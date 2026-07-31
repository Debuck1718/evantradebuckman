import { ClientService } from "../client/ClientService";
import { TokenService } from "../authorization/TokenService";

/**
 * OAuth RFC7009
 *
 * Revokes an Access Token or
 * Refresh Token.
 */
export class RevokeTokenWorkflow {

  constructor(

    private readonly clients: ClientService,

    private readonly tokens: TokenService,

  ) {}

  /**
   * Executes Token Revocation.
   */
  async execute(params: {

    clientId: string;

    clientSecret: string;

    /**
     * Access Token or
     * Refresh Token.
     */
    token: string;

  }): Promise<void> {

    //
    // Authenticate Client
    //
    await this.clients.authenticate({

      clientId:
        params.clientId,

      clientSecret:
        params.clientSecret,

    });

    //
    // RFC7009
    //
    // Unknown tokens MUST NOT
    // produce an error.
    //
    await this.tokens.revoke(

      params.token,

    );

  }

}