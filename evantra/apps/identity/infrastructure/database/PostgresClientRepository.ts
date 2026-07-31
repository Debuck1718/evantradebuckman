import { Pool } from "pg";

import {
  Client,
  ClientId,
  ClientRepository,
  ClientStatus,
} from "../../src/client";

/**
 * PostgreSQL implementation of
 * the Client repository.
 */
export class PostgresClientRepository
  implements ClientRepository {

  constructor(
    private readonly db: Pool
  ) {}

  /**
   * Stores a new Client.
   */
  async create(
    client: Client
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.clients (
        id,
        owner_account_id,
        name,
        slug,
        client_id,
        client_secret_hash,
        homepage_url,
        description,
        first_party,
        status,
        secret_version,
        secret_last_rotated_at,
        secret_expires_at,
        secret_revoked_at,
        created_at,
        updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14,$15,$16
      )
      `,
      [
        client.id,
        client.ownerAccountId,
        client.name,
        client.slug,
        client.clientId.value(),
        client.secretHash(),
        client.homepageUrl,
        client.description,
        client.firstParty,
        client.getStatus(),
        client.getSecretVersion(),
        client.getSecretLastRotatedAt(),
        client.getSecretExpiresAt(),
        client.getSecretRevokedAt(),
        client.createdAt,
        client.updated(),
      ]
    );

  }

  /**
   * Updates an existing Client.
   */
  async update(
    client: Client
  ): Promise<void> {

    await this.db.query(
      `
      UPDATE identity.clients
      SET

        name = $2,

        slug = $3,

        homepage_url = $4,

        description = $5,

        first_party = $6,

        status = $7,

        client_secret_hash = $8,

        secret_version = $9,

        secret_last_rotated_at = $10,

        secret_expires_at = $11,

        secret_revoked_at = $12,

        updated_at = $13

      WHERE id = $1
      `,
      [
        client.id,
        client.name,
        client.slug,
        client.homepageUrl,
        client.description,
        client.firstParty,
        client.getStatus(),
        client.secretHash(),
        client.getSecretVersion(),
        client.getSecretLastRotatedAt(),
        client.getSecretExpiresAt(),
        client.getSecretRevokedAt(),
        client.updated(),
      ]
    );

  }

  /**
   * Finds a Client by ID.
   */
  async findById(
    id: string
  ): Promise<Client | null> {

    const result =
      await this.db.query(
        `
        SELECT *
        FROM identity.clients
        WHERE id = $1
        LIMIT 1
        `,
        [id]
      );

    if (result.rowCount === 0) {
      return null;
    }

    return this.restore(
      result.rows[0]
    );

  }

  /**
   * Finds a Client using
   * its public Client ID.
   */
  async findByClientId(
    clientId: ClientId
  ): Promise<Client | null> {

    const result =
      await this.db.query(
        `
        SELECT *
        FROM identity.clients
        WHERE client_id = $1
        LIMIT 1
        `,
        [
          clientId.value(),
        ]
      );

    if (result.rowCount === 0) {
      return null;
    }

    return this.restore(
      result.rows[0]
    );

  }

  /**
   * Finds a Client by slug.
   */
  async findBySlug(
    slug: string
  ): Promise<Client | null> {

    const result =
      await this.db.query(
        `
        SELECT *
        FROM identity.clients
        WHERE slug = $1
        LIMIT 1
        `,
        [slug]
      );

    if (result.rowCount === 0) {
      return null;
    }

    return this.restore(
      result.rows[0]
    );

  }

  /**
   * Returns every Client
   * owned by an account.
   */
  async findByOwner(
    ownerAccountId: string
  ): Promise<Client[]> {

    const result =
      await this.db.query(
        `
        SELECT *
        FROM identity.clients
        WHERE owner_account_id = $1
        ORDER BY created_at
        `,
        [
          ownerAccountId,
        ]
      );

    return result.rows.map(
      row => this.restore(row)
    );

  }

  /**
   * Removes a Client.
   */
  async delete(
    id: string
  ): Promise<void> {

    await this.db.query(
      `
      DELETE
      FROM identity.clients
      WHERE id = $1
      `,
      [id]
    );

  }

  /**
   * Restores a Client aggregate.
   */
  private restore(
    row: any
  ): Client {

    return Client.restore({

      id: row.id,

      ownerAccountId:
        row.owner_account_id,

      clientId:
        ClientId.from(
          row.client_id
        ),

      clientSecretHash:
        row.client_secret_hash,

      name:
        row.name,

      slug:
        row.slug,

      homepageUrl:
        row.homepage_url,

      description:
        row.description,

      firstParty:
        row.first_party,

      status:
        row.status as ClientStatus,

      secretVersion:
        row.secret_version,

      secretLastRotatedAt:
        row.secret_last_rotated_at,

      secretExpiresAt:
        row.secret_expires_at,

      secretRevokedAt:
        row.secret_revoked_at,

      createdAt:
        row.created_at,

      updatedAt:
        row.updated_at,

    });

  }

}