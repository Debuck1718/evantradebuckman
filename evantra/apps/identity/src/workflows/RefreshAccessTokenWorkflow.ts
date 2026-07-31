import { ClientService } from "../client/ClientService";
import { TokenService } from "../authorization/TokenService";

/**
 * Refreshes an expired Access Token
 * using a valid Refresh Token.
 */
export class RefreshAccessTokenWorkflow {

  constructor(

    private readonly clients: ClientService,

    private readonly tokens: TokenService,

  ) {}

  /**
   * Executes the Refresh Token Grant.
   */
  async execute(params: {

    clientId: string;

    clientSecret: string;

    refreshToken: string;

    accessTokenLifetime: number;

    refreshTokenLifetime: number;

  }): Promise<{

    accessToken: string;

    refreshToken: string;

    tokenType: "Bearer";

    expiresIn: number;

  }> {

    //
    // Authenticate OAuth Client.
    //
    const client =
      await this.clients.authenticate({

        clientId:
          params.clientId,

        clientSecret:
          params.clientSecret,

      });

    //
    // Refresh Tokens.
    //
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

    return {

      accessToken:
        issued.accessToken.token,

      refreshToken:
        issued.refreshToken.token,

      tokenType:
        "Bearer",

      expiresIn:
        Math.floor(
          params.accessTokenLifetime /
          1000,
        ),

    };

  }

}