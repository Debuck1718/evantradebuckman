import {
  ClientService,
} from "../client";

import {
  ClientCredentialGenerator,
} from "../platform/ClientCredentialGenerator";

import {
  PasswordHasher,
} from "../authentication";

/**
 * Rotates an OAuth Client Secret.
 *
 * The plain Client Secret is returned only once.
 */
export class RotateClientSecretWorkflow {

  constructor(

    private readonly clients:
      ClientService,

    private readonly credentials:
      ClientCredentialGenerator,

    private readonly hasher:
      PasswordHasher,

  ) {}

  /**
   * Rotates the Client Secret.
   */
  async execute(params: {

    clientId: string;

    expiresAt?: Date | null;

  }): Promise<{

    client: Awaited<
      ReturnType<ClientService["findByClientId"]>
    > extends infer T
      ? Exclude<T, null>
      : never;

    clientSecret: string;

  }> {

    // ------------------------------------------------------
    // Find Client
    // ------------------------------------------------------

    const client =
      await this.clients.findByClientId(
        params.clientId,
      );

    if (!client) {

      throw new Error(
        "Client not found.",
      );

    }

    // ------------------------------------------------------
    // Generate new secret
    // ------------------------------------------------------

    const clientSecret =
      this.credentials.clientSecret();

    // ------------------------------------------------------
    // Hash secret
    // ------------------------------------------------------

    const hash =
      await this.hasher.hash(
        clientSecret,
      );

    // ------------------------------------------------------
    // Rotate
    // ------------------------------------------------------

    client.rotateSecret(

      hash,

      params.expiresAt ?? null,

    );

    // ------------------------------------------------------
    // Persist
    // ------------------------------------------------------

    await this.clients.update(
      client,
    );

    // ------------------------------------------------------
    // Return plain secret ONCE
    // ------------------------------------------------------

    return {

      client,

      clientSecret,

    };

  }

}