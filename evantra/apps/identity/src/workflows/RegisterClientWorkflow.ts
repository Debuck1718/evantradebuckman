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

function parseBoolean(
  value: string,
): boolean {
  const normalized =
    value.trim().toLowerCase();

  return normalized === "true" ||
    normalized === "1" ||
    normalized === "yes";
}

function shouldAutoApproveFirstParty(): boolean {
  const configured =
    process.env.EVANTRA_CLIENT_AUTO_APPROVE_FIRST_PARTY;

  if (configured !== undefined) {
    return parseBoolean(configured);
  }

  return process.env.NODE_ENV !== "production";
}

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

    if (
      (params.firstParty ?? false) &&
      shouldAutoApproveFirstParty()
    ) {
      client.approve();
    }

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