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

  async execute(params: {
    clientId: string;
    redirectUri: string;
    primary?: boolean;
  }): Promise<ClientRedirectUri> {

    const client =
      await this.clients.findByClientId(
        params.clientId
      );

    if (!client) {
      throw new Error("Client not found.");
    }

    const redirect =
      ClientRedirectUri.create({
        id: this.ids.redirectUri(),
        clientId: client.id,
        redirectUri: RedirectUri.from(
          params.redirectUri
        ),
        primary: params.primary ?? false,
      });

    await this.redirectUris.register(
      redirect
    );

    return redirect;
  }
}