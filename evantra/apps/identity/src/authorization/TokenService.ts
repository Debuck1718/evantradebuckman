import { AccessToken } from "./AccessToken";
import { RefreshToken } from "./RefreshToken";

import { AccessTokenRepository } from "./AccessTokenRepository";
import { RefreshTokenRepository } from "./RefreshTokenRepository";

import { IdGenerator } from "../platform/IdGenerator";
import { OAuthTokenGenerator } from "../platform/OAuthTokenGenerator";
import { Clock } from "../platform/Clock";

import {
  InvalidGrantError,
} from "../oauth/errors";

import {
  TokenIntrospection,
} from "../oauth";
/**
 * Issues and manages OAuth Tokens.
 */
export class TokenService {

  constructor(

    private readonly accessTokens: AccessTokenRepository,

    private readonly refreshTokens: RefreshTokenRepository,

    private readonly ids: IdGenerator,

    private readonly oauthTokens: OAuthTokenGenerator,

    private readonly clock: Clock,

  ) {}

  /**
   * Issues a new Access Token and
   * Refresh Token pair.
   */
  async issue(params: {

    accountId: string;

    clientId: string;

    scopes: string[];

    /**
     * Lifetime in milliseconds.
     */
    accessTokenLifetime: number;

    /**
     * Lifetime in milliseconds.
     */
    refreshTokenLifetime: number;

  }): Promise<{

    accessToken: AccessToken;

    refreshToken: RefreshToken;

  }> {

    const now =
      this.clock.now();

    //
    // Create Access Token
    //
    const accessToken =
      AccessToken.create({

        id:
          this.ids.accessToken(),

        accountId:
          params.accountId,

        clientId:
          params.clientId,

        token:
          this.oauthTokens.accessToken(),

        scopes:
          params.scopes,

        expiresAt:
          new Date(
            now.getTime() +
            params.accessTokenLifetime
          ),

      });

    await this.accessTokens.create(
      accessToken,
    );

    //
    // Create Refresh Token
    //
    const refreshToken =
      RefreshToken.create({

        id:
          this.ids.refreshToken(),

        accessTokenId:
          accessToken.id,

        accountId:
          params.accountId,

        clientId:
          params.clientId,

        token:
          this.oauthTokens.refreshToken(),

        scopes:
          params.scopes,

        expiresAt:
          new Date(
            now.getTime() +
            params.refreshTokenLifetime
          ),

      });

    await this.refreshTokens.create(
      refreshToken,
    );

    return {

      accessToken,

      refreshToken,

    };

  }

  /**
 * Finds an active Access Token.
 */
async findAccessToken(
  token: string,
): Promise<AccessToken> {

  const accessToken =
    await this.accessTokens.findActiveByToken(
      token,
    );

  if (!accessToken) {

    throw new InvalidGrantError(
      "Access Token is invalid.",
    );

  }

  return accessToken;

}

/**
 * Validates an Access Token.
 */
async validateAccessToken(
  token: string,
): Promise<AccessToken> {

  const accessToken =
    await this.findAccessToken(
      token,
    );

  if (!accessToken.isActive()) {

    throw new InvalidGrantError(

      "Access Token is no longer active.",

    );

  }

  return accessToken;

}

 /**
 * Finds an active Refresh Token.
 */
async findRefreshToken(
  token: string,
): Promise<RefreshToken> {

  const refreshToken =
    await this.refreshTokens.findActiveByToken(
      token,
    );

  if (!refreshToken) {

    throw new InvalidGrantError(
      "Refresh Token is invalid.",
    );

  }

  return refreshToken;

}
/**
 * Validates a Refresh Token.
 */
async validateRefreshToken(
  token: string,
): Promise<RefreshToken> {

  const refreshToken =
    await this.findRefreshToken(
      token,
    );

  if (!refreshToken.isActive()) {

    throw new InvalidGrantError(

      "Refresh Token is no longer active.",

    );

  }

  return refreshToken;

}
  /**
 * Exchanges a Refresh Token
 * for a new Access Token and
 * Refresh Token pair.
 *
 * Refresh Token Rotation
 * (OAuth 2.1)
 */
async refresh(params: {

  /**
   * Authenticated OAuth Client.
   */
  clientId: string;

  /**
   * Public Refresh Token.
   */
  refreshToken: string;

  /**
   * Lifetime in milliseconds.
   */
  accessTokenLifetime: number;

  /**
   * Lifetime in milliseconds.
   */
  refreshTokenLifetime: number;

}): Promise<{

  accessToken: AccessToken;

  refreshToken: RefreshToken;

}> {

  // ==========================================================
  // Lookup Refresh Token
  // ==========================================================

  const existingRefreshToken =
    await this.refreshTokens.findByToken(
      params.refreshToken,
    );

  if (!existingRefreshToken) {

    throw new InvalidGrantError(
      "Refresh Token is invalid.",
    );

  }

  // ==========================================================
  // Replay Detection
  // ==========================================================

  if (existingRefreshToken.isRevoked()) {

    //
    // Refresh Token replay attack.
    // Revoke the entire token family.
    //
    await this.revokeTokenFamily(
      existingRefreshToken.accessTokenId,
    );

    throw new InvalidGrantError(
      "Refresh Token has already been used.",
    );

  }

  // ==========================================================
  // Expiration
  // ==========================================================

  if (existingRefreshToken.hasExpired()) {

    throw new InvalidGrantError(
      "Refresh Token has expired.",
    );

  }

  // ==========================================================
  // Client Ownership
  // ==========================================================

  if (
    existingRefreshToken.clientId !==
    params.clientId
  ) {

    throw new InvalidGrantError(
      "Refresh Token does not belong to the authenticated client.",
    );

  }

  // ==========================================================
  // Rotate Refresh Token
  // ==========================================================

  existingRefreshToken.revoke();

  await this.refreshTokens.update(
    existingRefreshToken,
  );

  // ==========================================================
  // Revoke Existing Access Token
  // ==========================================================

  const existingAccessToken =
    await this.accessTokens.findById(
      existingRefreshToken.accessTokenId,
    );

  if (
    existingAccessToken &&
    !existingAccessToken.isRevoked()
  ) {

    existingAccessToken.revoke();

    await this.accessTokens.update(
      existingAccessToken,
    );

  }

  // ==========================================================
  // Issue Replacement Pair
  // ==========================================================

  // TODO:
  // Publish TOKEN_REFRESHED audit event.

  return this.issue({

    accountId:
      existingRefreshToken.accountId,

    clientId:
      existingRefreshToken.clientId,

    scopes:
      [...existingRefreshToken.scopes()],

    accessTokenLifetime:
      params.accessTokenLifetime,

    refreshTokenLifetime:
      params.refreshTokenLifetime,

  });

}

  /**
 * Revokes an OAuth Token.
 *
 * RFC7009
 *
 * Revocation is idempotent.
 * Unknown tokens still return success.
 */
async revoke(
  token: string,
): Promise<void> {

  // ==========================================================
  // Access Token
  // ==========================================================

  const accessToken =
    await this.accessTokens.findByToken(
      token,
    );

  if (accessToken) {

    if (!accessToken.isRevoked()) {

      accessToken.revoke();

      await this.accessTokens.update(
        accessToken,
      );

    }

    // TODO:
    // Publish TOKEN_REVOKED event.

    return;

  }

  // ==========================================================
  // Refresh Token
  // ==========================================================

  const refreshToken =
    await this.refreshTokens.findByToken(
      token,
    );

  if (refreshToken) {

    if (!refreshToken.isRevoked()) {

      refreshToken.revoke();

      await this.refreshTokens.update(
        refreshToken,
      );

    }

    // TODO:
    // Publish TOKEN_REVOKED event.

  }

  //
  // RFC7009:
  // Unknown tokens MUST still
  // return success.
  //

}

  /**
 * Revokes an Access Token
 * and every associated
 * Refresh Token.
 *
 * Used when Refresh Token
 * replay is detected.
 */
async revokeTokenFamily(
  accessTokenId: string,
): Promise<void> {

  const accessToken =
    await this.accessTokens.findById(
      accessTokenId,
    );

  if (
    accessToken &&
    !accessToken.isRevoked()
  ) {

    accessToken.revoke();

    await this.accessTokens.update(
      accessToken,
    );

  }

  const refreshToken =
    await this.refreshTokens.findByAccessTokenId(
      accessTokenId,
    );

  if (
    refreshToken &&
    !refreshToken.isRevoked()
  ) {

    refreshToken.revoke();

    await this.refreshTokens.update(
      refreshToken,
    );

  }

}

  /**
 * RFC7662
 * OAuth Token Introspection.
 */
async introspect(
  token: string,
): Promise<TokenIntrospection> {

  const accessToken =
    await this.accessTokens.findByToken(
      token,
    );

  if (
    !accessToken ||
    !accessToken.isActive()
  ) {

    return new TokenIntrospection(

      false,

      null,

      null,

      null,

      null,

    );

  }

  return new TokenIntrospection(

    true,

    accessToken.clientId,

    accessToken.accountId,

    accessToken
      .scopes()
      .join(" "),

    Math.floor(

      accessToken.expiresAt.getTime() /
      1000,

    ),

  );

}

}

