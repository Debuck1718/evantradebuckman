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
    clientSecret: string;
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

    const verified =
      await this.hasher.verify(
        params.clientSecret,
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