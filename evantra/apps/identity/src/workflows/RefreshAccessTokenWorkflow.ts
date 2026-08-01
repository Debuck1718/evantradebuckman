import {
  ClientService,
} from "../client";

import {
  TokenService,
} from "../authorization";

import {
  TokenResponse,
  OAuthTokenType,
} from "../oauth";

/**
 * Executes the OAuth
 * Refresh Token Grant.
 */
export class RefreshAccessTokenWorkflow {

  constructor(

    private readonly clients: ClientService,

    private readonly tokens: TokenService,

  ) {}

  /**
   * Refreshes an OAuth
   * Access Token.
   */
  async execute(params: {

    clientId: string;

    clientSecret: string;

    refreshToken: string;

    accessTokenLifetime: number;

    refreshTokenLifetime: number;

  }): Promise<TokenResponse> {

    // ==========================================================
    // Authenticate Client
    // ==========================================================

    const client =
      await this.clients.authenticate({

        clientId:
          params.clientId,

        clientSecret:
          params.clientSecret,

      });

    // ==========================================================
    // Refresh Tokens
    // ==========================================================

    const issued =
      await this.tokens.refresh({

        clientId:
          client.id,

        refreshToken:
          params.refreshToken,

        accessTokenLifetime:
          params.accessTokenLifetime,

        refreshTokenLifetime:
          params.refreshTokenLifetime,

      });

    // ==========================================================
    // OAuth Response
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