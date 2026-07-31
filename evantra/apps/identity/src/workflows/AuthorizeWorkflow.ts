import {
  Client,
  ClientService,
  ClientRedirectUri,
  ClientRedirectUriService,
} from "../client";

import {
  AuthorizationRequest,
} from "../authorization";

/**
 * Begins an OAuth
 * Authorization request.
 *
 * This workflow validates an
 * incoming OAuth request before
 * authentication, consent and
 * authorization code issuance.
 */
export class AuthorizeWorkflow {

  constructor(

    private readonly clients: ClientService,

    private readonly redirects: ClientRedirectUriService,

  ) {}

  /**
   * Validates an authorization request.
   */
  async execute(
    request: AuthorizationRequest
  ): Promise<{

    client: Client;

    redirectUri: ClientRedirectUri;

  }> {

    // --------------------------------------------------
    // Find Client.
    // --------------------------------------------------

    const client =
      await this.clients.findByClientId(
        request.clientId.value()
      );

    if (!client) {
      throw new Error(
        "OAuth client not found."
      );
    }

    // --------------------------------------------------
    // Client must be active.
    // --------------------------------------------------

    if (!client.isActive()) {
      throw new Error(
        "OAuth client is not active."
      );
    }

    // --------------------------------------------------
    // Redirect URI must be registered.
    // --------------------------------------------------

    const redirect =
      await this.redirects.findByRedirectUri(
        client.id,
        request.redirectUri
      );

    if (!redirect) {
      throw new Error(
        "Redirect URI is not registered."
      );
    }

    // --------------------------------------------------
    // Validation successful.
    // --------------------------------------------------

    return {

      client,

      redirectUri: redirect,

    };

  }

}