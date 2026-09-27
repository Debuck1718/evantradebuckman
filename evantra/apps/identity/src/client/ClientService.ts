import { PasswordHasher } from "../authentication";

import { Client } from "./Client";
import { ClientId } from "./ClientId";
import { ClientRepository } from "./ClientRepository";

/**
 * Coordinates OAuth Client
 * operations.
 */
export class ClientService {

  constructor(
    private readonly repository: ClientRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async register(
    client: Client,
  ): Promise<Client> {

    const existingClientId =
      await this.repository.findByClientId(
        client.clientId,
      );

    if (existingClientId) {
      throw new Error(
        "Client ID already exists.",
      );
    }

    const existingSlug =
      await this.repository.findBySlug(
        client.slug,
      );

    if (existingSlug) {
      throw new Error(
        "Client slug already exists.",
      );
    }

    await this.repository.create(
      client,
    );

    return client;
  }

  async findById(
    id: string,
  ): Promise<Client | null> {

    return this.repository.findById(
      id,
    );
  }

  async findByClientId(
    value: string,
  ): Promise<Client | null> {

    return this.repository.findByClientId(
      ClientId.from(value),
    );
  }

  async authenticate(params: {
    clientId: string;

    /*
     * Optional: a public client sends no secret.
     * Declared optional rather than required-and-empty
     * so the "no secret was sent" case is distinguishable
     * from "an empty secret was sent". `| undefined` is
     * explicit because this package sets
     * exactOptionalPropertyTypes.
     */
    clientSecret?: string | undefined;
  }): Promise<Client> {

    const client =
      await this.findByClientId(
        params.clientId,
      );

    if (!client) {
      throw new Error(
        "Invalid client credentials.",
      );
    }

    if (!client.isActive()) {
      throw new Error(
        "Client is not active.",
      );
    }

    /*
     * Public clients hold no secret, so there is
     * nothing to verify. Verifying anyway would make
     * hasher.verify("", "") the only way in, which is
     * not a credential. Identity is established by PKCE
     * at the grant layer, not here.
     */
    if (client.isPublic()) {

      if (
        params.clientSecret !== undefined &&
        params.clientSecret !== ""
      ) {

        throw new Error(
          "A public client cannot present a client secret.",
        );

      }

      return client;
    }

    /*
     * Confidential clients must present a secret.
     * An absent secret is treated as a failed
     * verification rather than a missing parameter,
     * so a caller cannot probe for which clients
     * are public.
     */
    const verified =
      await this.hasher.verify(
        params.clientSecret ?? "",
        client.secretHash(),
      );

    if (!verified) {
      throw new Error(
        "Invalid client credentials.",
      );
    }

    return client;
  }

  /**
 * Rotates an OAuth Client Secret.
 *
 * The plaintext secret is never persisted.
 */
async rotateSecret(
  client: Client,
  newSecret: string,
  expiresAt: Date | null = null,
): Promise<void> {

  const hash =
    await this.hasher.hash(
      newSecret,
    );

  client.rotateSecret(
    hash,
    expiresAt,
  );

  await this.repository.update(
    client,
  );
}

  async findByOwner(
    ownerAccountId: string,
  ): Promise<Client[]> {

    return this.repository.findByOwner(
      ownerAccountId,
    );
  }

  async approve(
    client: Client,
  ): Promise<void> {

    client.approve();

    await this.repository.update(
      client,
    );
  }

  async disable(
    client: Client,
  ): Promise<void> {

    client.disable();

    await this.repository.update(
      client,
    );
  }

  async revoke(
    client: Client,
  ): Promise<void> {

    client.revoke();

    await this.repository.update(
      client,
    );
  }

  async update(
  client: Client
): Promise<void> {

  await this.repository.update(
    client,
  );

}
}