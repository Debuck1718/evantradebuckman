import { ClientService } from "../client/ClientService";
import { TokenService } from "../authorization/TokenService";

/**
 * OAuth RFC7662
 *
 * Token Introspection.
 */
export class IntrospectTokenWorkflow {

  constructor(

    private readonly clients: ClientService,

    private readonly tokens: TokenService,

  ) {}

  async execute(params: {

    clientId: string;

    clientSecret: string;

    token: string;

  }) {

    //
    // Authenticate Client
    //
    await this.clients.authenticate({

      clientId:
        params.clientId,

      clientSecret:
        params.clientSecret,

    });

    return this.tokens.introspect(

      params.token,

    );

  }

}