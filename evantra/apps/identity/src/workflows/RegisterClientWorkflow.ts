import {
  Client,
  ClientId,
  ClientService,
} from "../client";

import {
  PasswordHasher,
} from "../authentication";

import {
  IdGenerator,
} from "../platform/IdGenerator";

import {
  ClientCredentialGenerator,
} from "../platform/ClientCredentialGenerator";

/**
 * Registers a new OAuth Client.
 *
 * The plain Client Secret
 * is returned only once.
 */
export class RegisterClientWorkflow {

  constructor(

    private readonly clients: ClientService,

    private readonly ids: IdGenerator,

    private readonly credentials: ClientCredentialGenerator,

    private readonly hasher: PasswordHasher,

  ) {}

  /**
   * Registers a Client.
   */
  async execute(params: {

    ownerAccountId: string;

    name: string;

    slug: string;

    homepageUrl?: string;

    description?: string;

    firstParty?: boolean;

  }): Promise<{

    client: Client;

    clientSecret: string;

  }> {

    // ----------------------------------------------------------
    // Generate OAuth credentials.
    // ----------------------------------------------------------

    const publicClientId =
      this.credentials.clientId();

    const clientSecret =
      this.credentials.clientSecret();

    // ----------------------------------------------------------
    // Hash secret.
    // ----------------------------------------------------------

    const hash =
      await this.hasher.hash(
        clientSecret
      );

    // ----------------------------------------------------------
    // Create Client aggregate.
    // ----------------------------------------------------------

    const client =
      Client.create({

        id:
          this.ids.client(),

        ownerAccountId:
          params.ownerAccountId,

        clientId:
          ClientId.from(
            publicClientId
          ),

        clientSecretHash:
          hash,

        name:
          params.name,

        slug:
          params.slug,

        ...(params.homepageUrl !== undefined
          ? {
              homepageUrl:
                params.homepageUrl,
            }
          : {}),

        ...(params.description !== undefined
          ? {
              description:
                params.description,
            }
          : {}),

        ...(params.firstParty !== undefined
          ? {
              firstParty:
                params.firstParty,
            }
          : {}),

      });

    // ----------------------------------------------------------
    // Persist.
    // ----------------------------------------------------------

    await this.clients.register(
      client
    );

    return {

      client,

      clientSecret,

    };

  }

}