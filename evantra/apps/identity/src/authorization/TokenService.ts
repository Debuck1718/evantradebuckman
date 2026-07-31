import { AccessToken } from "./AccessToken";
import { RefreshToken } from "./RefreshToken";
import { AccessTokenRepository } from "./AccessTokenRepository";
import { RefreshTokenRepository } from "./RefreshTokenRepository";

import { IdGenerator } from "../platform/IdGenerator";
import { OAuthTokenGenerator } from "../platform/OAuthTokenGenerator";
import { Clock } from "../platform/Clock";

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
      throw new Error(
        "Access Token is invalid."
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
      throw new Error(
        "Refresh Token is invalid."
      );
    }

    return refreshToken;

  }

  /**
 * Exchanges a Refresh Token for
 * a new Access Token and
 * Refresh Token pair.
 */
async refresh(params: {

  /**
   * OAuth Client requesting
   * the refresh.
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

  //
  // Find Refresh Token
  //
  const existingRefreshToken =
    await this.findRefreshToken(
      params.refreshToken,
    );

  //
  // Ensure the token belongs
  // to the authenticated client.
  //
  if (
    existingRefreshToken.clientId !==
    params.clientId
  ) {

    throw new Error(
      "Refresh Token does not belong to the client."
    );

  }

  //
  // Revoke old Refresh Token.
  //
  existingRefreshToken.revoke();

  await this.refreshTokens.update(
    existingRefreshToken,
  );

  //
  // Revoke associated
  // Access Token.
  //
  const existingAccessToken =
    await this.accessTokens.findById(
      existingRefreshToken.accessTokenId,
    );

  if (
    existingAccessToken &&
    existingAccessToken.isActive()
  ) {

    existingAccessToken.revoke();

    await this.accessTokens.update(
      existingAccessToken,
    );

  }

  //
  // Issue replacement pair.
  //
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
   * Revokes an Access Token or
   * Refresh Token.
   *
   * RFC7009 requires successful
   * responses even when the token
   * is unknown.
   */
  async revoke(
    token: string,
  ): Promise<void> {

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

      return;

    }

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

    }

  }

  /**
 * Introspects an Access Token.
 */
async introspect(
  token: string,
): Promise<{

  active: boolean;

  accountId?: string;

  clientId?: string;

  scopes?: readonly string[];

  expiresAt?: Date;

}> {

  const accessToken =
    await this.accessTokens.findByToken(
      token,
    );

  if (
    !accessToken ||
    !accessToken.isActive()
  ) {

    return {

      active: false,

    };

  }

  return {

    active: true,

    accountId:
      accessToken.accountId,

    clientId:
      accessToken.clientId,

    scopes:
      accessToken.scopes(),

    expiresAt:
      accessToken.expiresAt,

  };

}

}

