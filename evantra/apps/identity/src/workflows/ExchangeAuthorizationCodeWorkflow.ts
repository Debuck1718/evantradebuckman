import {
  AuthorizationCodeService,
  TokenService,
} from "../authorization";

import {
  ClientService,
} from "../client";

import {
  TokenResponse,
  OAuthTokenType,
} from "../oauth";

import {
  InvalidGrantError,
} from "../oauth/errors";

import {
  PkceVerifier,
} from "../platform/PkceVerifier";

/**
 * Exchanges an OAuth
 * Authorization Code
 * for OAuth Tokens.
 */
export class ExchangeAuthorizationCodeWorkflow {

  constructor(
    private readonly clients: ClientService,

    private readonly authorizationCodes:
      AuthorizationCodeService,

    private readonly tokens:
      TokenService,

    private readonly pkce:
      PkceVerifier,
  ) {}

  /**
   * Executes the OAuth
   * Authorization Code Grant.
   */
  async execute(params: {
    clientId: string;
    clientSecret: string;
    code: string;
    codeVerifier: string;
    redirectUri: string;

    accessTokenLifetime: number;
    refreshTokenLifetime: number;
  }): Promise<TokenResponse> {

    // ==========================================================
    // Authenticate OAuth Client
    // ==========================================================

    const client =
      await this.clients.authenticate({

        clientId:
          params.clientId,

        clientSecret:
          params.clientSecret,

      });

    // ==========================================================
    // Load Active Authorization Code
    // ==========================================================

    const authorizationCode =
      await this.authorizationCodes.findActive(
        params.code,
      );

    // ==========================================================
    // Ensure Authorization Code
    // belongs to this Client
    // ==========================================================

    if (
      authorizationCode.clientId !==
      client.id
    ) {

      throw new InvalidGrantError(
        "Authorization Code does not belong to this client.",
      );

    }

    // ==========================================================
    // Validate Redirect URI
    // ==========================================================

    if (
      authorizationCode
        .redirectUri
        .value() !==
      params.redirectUri
    ) {

      throw new InvalidGrantError(
        "Invalid redirect URI.",
      );

    }

    // ==========================================================
    // Verify PKCE
    // ==========================================================

    const validPkce =
      await this.pkce.verify({

        codeVerifier:
          params.codeVerifier,

        codeChallenge:
          authorizationCode.codeChallenge,

        method:
          authorizationCode.codeChallengeMethod,

      });

    if (!validPkce) {

      throw new InvalidGrantError(
        "PKCE verification failed.",
      );

    }

    // ==========================================================
    // Consume Authorization Code
    // ==========================================================

    await this.authorizationCodes.consume(
      authorizationCode,
    );

    // ==========================================================
    // Issue Access + Refresh Tokens
    // ==========================================================

    const issued =
      await this.tokens.issue({

        accountId:
          authorizationCode.accountId,

        clientId:
          client.id,

        scopes:
          [...authorizationCode.scopes()],

        accessTokenLifetime:
          params.accessTokenLifetime,

        refreshTokenLifetime:
          params.refreshTokenLifetime,

      });

    // ==========================================================
    // OAuth Token Response
    // ==========================================================

    return new TokenResponse(

      issued.accessToken.token,

      OAuthTokenType.BEARER,

      Math.floor(
        params.accessTokenLifetime / 1000,
      ),

      issued.refreshToken.token,

      issued.accessToken
        .scopes()
        .join(" "),

    );
  }
}