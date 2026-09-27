import {
  Client,
  ClientId,
  ClientScopeService,
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

/*
 * The scopes every newly registered client is
 * registered for.
 *
 * These are the OIDC identity scopes and nothing
 * else. A client must be able to complete a
 * sign-in, but must never be able to reach data
 * it was not separately approved for.
 *
 * This used to be an empty set, which meant EVERY
 * authorization request failed with invalid_scope:
 * AuthorizeWorkflow.filterAllowed() could never
 * match anything against an empty registered set.
 * The scopes were documented as the default
 * everywhere (SDK, consent screen, guides) but were
 * never actually written to identity.client_scopes,
 * so the documented default and the enforced
 * default disagreed.
 */
const DEFAULT_CLIENT_SCOPES = [
  "openid",
  "profile",
  "email",
] as const;

/**
 * Registers a new OAuth Client.
 *
 * The plain Client Secret
 * is returned only once.
 */
export class RegisterClientWorkflow {

  constructor(

    private readonly clients: ClientService,

    private readonly clientScopes:
      ClientScopeService,

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

    /*
     * "confidential" (default) issues a client secret
     * and requires it at the token endpoint.
     *
     * "public" issues NO secret. Browser and native
     * apps must be public: a secret shipped inside an
     * app binary is extractable and is not a secret
     * (RFC8252).
     */
    clientType?: "public" | "confidential";

    /*
     * Overrides the default registered scope set.
     */
    scopes?: string[];

  }): Promise<{

    client: Client;

    clientSecret: string | null;

  }> {

    // ----------------------------------------------------------
    // Resolve the client type.
    // ----------------------------------------------------------

    const publicClient =
      params.clientType === "public";

    // ----------------------------------------------------------
    // Generate OAuth credentials.
    // ----------------------------------------------------------

    const publicClientId =
      this.credentials.clientId();

    /*
     * A public client gets no secret at all — not a
     * random one, not an empty one. The stored hash is
     * the empty string, which is what Client.isPublic()
     * keys off, so the absence of a secret is recorded
     * explicitly rather than inferred from a value
     * that could also mean "not set yet".
     */
    const clientSecret =
      publicClient
        ? null
        : this.credentials.clientSecret();

    // ----------------------------------------------------------
    // Hash secret.
    // ----------------------------------------------------------

    const hash =
      clientSecret === null
        ? ""
        : await this.hasher.hash(
            clientSecret,
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

    // ----------------------------------------------------------
    // Register the default scope set.
    // ----------------------------------------------------------

    /*
     * Without this, a client is registered with zero
     * scopes and EVERY authorization request is rejected
     * as invalid_scope. The set is the OIDC identity
     * scopes unless the caller explicitly overrides it.
     */
    await this.clientScopes.replace({
      clientId: client.id,
      scopes:
        params.scopes ??
        [...DEFAULT_CLIENT_SCOPES],
    });

    return {

      client,

      clientSecret,

    };

  }

}