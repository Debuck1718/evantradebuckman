import {
  AuthorizationCodeService,
  TokenService,
} from "../authorization";

import {
  ClientService,
} from "../client";

/**
 * Exchanges an OAuth
 * Authorization Code
 * for OAuth Tokens.
 */
export class ExchangeAuthorizationCodeWorkflow {

  constructor(

    private readonly clients: ClientService,

    private readonly authorizationCodes: AuthorizationCodeService,

    private readonly tokens: TokenService,

  ) {}

  /**
   * Executes the OAuth
   * Authorization Code Grant.
   */
  async execute(params: {

    clientId: string;

    clientSecret: string;

    code: string;

    redirectUri: string;

    accessTokenLifetime: number;

    refreshTokenLifetime: number;

  }): Promise<{

    accessToken: string;

    refreshToken: string;

    tokenType: "Bearer";

    expiresIn: number;

    scope: string;

  }> {

    // ----------------------------------------------------------
    // Authenticate OAuth Client.
    // ----------------------------------------------------------

    const client =
      await this.clients.authenticate({

        clientId:
          params.clientId,

        clientSecret:
          params.clientSecret,

      });

    // ----------------------------------------------------------
    // Load Authorization Code.
    // ----------------------------------------------------------

    const authorizationCode =
      await this.authorizationCodes.findActive(
        params.code
      );

    // ----------------------------------------------------------
    // Ensure the Authorization Code
    // belongs to the authenticated
    // OAuth Client.
    // ----------------------------------------------------------

    if (
      authorizationCode.clientId !==
      client.id
    ) {
      throw new Error(
        "Authorization Code does not belong to this client."
      );
    }

    // ----------------------------------------------------------
    // Validate Redirect URI.
    // ----------------------------------------------------------

    if (
      authorizationCode
        .redirectUri
        .value() !== params.redirectUri
    ) {
      throw new Error(
        "Invalid redirect URI."
      );
    }

    // ----------------------------------------------------------
    // Consume Authorization Code.
    // ----------------------------------------------------------

    await this.authorizationCodes.consume(
      authorizationCode
    );

    // ----------------------------------------------------------
    // Issue OAuth Tokens.
    // ----------------------------------------------------------

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

    return {

      accessToken:
        issued.accessToken.token,

      refreshToken:
        issued.refreshToken.token,

      tokenType:
        "Bearer",

      expiresIn:
        Math.floor(
          params.accessTokenLifetime / 1000
        ),

      scope:
        issued.accessToken
          .scopes()
          .join(" "),

    };

  }

}