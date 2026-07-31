import {
  ClientService,
  ClientRedirectUri,
  ClientRedirectUriService,
  RedirectUri,
} from "../client";

import {
  IdGenerator,
} from "../platform/IdGenerator";

/**
 * Registers a Redirect URI
 * for an OAuth Client.
 */
export class RegisterClientRedirectUriWorkflow {

  constructor(

    private readonly clients: ClientService,

    private readonly redirectUris: ClientRedirectUriService,

    private readonly ids: IdGenerator,

  ) {}

  /**
   * Registers a Redirect URI.
   */
  async execute(params: {

    clientId: string;

    redirectUri: string;

    primary?: boolean;

  }): Promise<ClientRedirectUri> {

    // ----------------------------------------------------------
    // Ensure the Client exists.
    // ----------------------------------------------------------

    const client =
      await this.clients.findById(
        params.clientId
      );

    if (!client) {
      throw new Error(
        "Client not found."
      );
    }

    // ----------------------------------------------------------
    // Create Redirect URI.
    // ----------------------------------------------------------

    const redirect =
      ClientRedirectUri.create({

        id:
          this.ids.redirectUri(),

        clientId:
          client.id,

        redirectUri:
          RedirectUri.from(
            params.redirectUri
          ),

        ...(params.primary !== undefined
          ? {
              primary:
                params.primary,
            }
          : {}),

      });

    // ----------------------------------------------------------
    // Persist.
    // ----------------------------------------------------------

    await this.redirectUris.register(
      redirect
    );

    return redirect;

  }

}