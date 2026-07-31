import { Pool } from "pg";

import {
  ClientRedirectUri,
  ClientRedirectUriRepository,
  RedirectUri,
} from "../../src/client";

/**
 * PostgreSQL implementation of
 * the Client Redirect URI repository.
 */
export class PostgresClientRedirectUriRepository
  implements ClientRedirectUriRepository {

  constructor(
    private readonly db: Pool
  ) {}

  /**
   * Stores a Redirect URI.
   */
  async create(
    redirect: ClientRedirectUri
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.client_redirect_uris (
        id,
        client_id,
        redirect_uri,
        primary_redirect,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        redirect.id,
        redirect.clientId,
        redirect.redirectUri.value(),
        redirect.isPrimary(),
        redirect.createdAt,
      ]
    );

  }

  /**
   * Persists changes.
   */
  async update(
    redirect: ClientRedirectUri
  ): Promise<void> {

    await this.db.query(
      `
      UPDATE identity.client_redirect_uris
      SET
        primary_redirect = $2
      WHERE id = $1
      `,
      [
        redirect.id,
        redirect.isPrimary(),
      ]
    );

  }

  /**
   * Finds a Redirect URI by ID.
   */
  async findById(
    id: string
  ): Promise<ClientRedirectUri | null> {

    const result =
      await this.db.query(
        `
        SELECT *
        FROM identity.client_redirect_uris
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
   * Returns every Redirect URI
   * registered for a Client.
   */
  async findByClientId(
    clientId: string
  ): Promise<ClientRedirectUri[]> {

    const result =
      await this.db.query(
        `
        SELECT *
        FROM identity.client_redirect_uris
        WHERE client_id = $1
        ORDER BY created_at
        `,
        [clientId]
      );

    return result.rows.map(
      row => this.restore(row)
    );

  }

  /**
   * Finds an exact Redirect URI.
   */
  async findByRedirectUri(
    clientId: string,
    redirectUri: RedirectUri
  ): Promise<ClientRedirectUri | null> {

    const result =
      await this.db.query(
        `
        SELECT *
        FROM identity.client_redirect_uris
        WHERE client_id = $1
        AND redirect_uri = $2
        LIMIT 1
        `,
        [
          clientId,
          redirectUri.value(),
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
   * Returns the primary Redirect URI.
   */
  async findPrimary(
    clientId: string
  ): Promise<ClientRedirectUri | null> {

    const result =
      await this.db.query(
        `
        SELECT *
        FROM identity.client_redirect_uris
        WHERE client_id = $1
        AND primary_redirect = TRUE
        LIMIT 1
        `,
        [clientId]
      );

    if (result.rowCount === 0) {
      return null;
    }

    return this.restore(
      result.rows[0]
    );

  }

  /**
   * Removes a Redirect URI.
   */
  async delete(
    id: string
  ): Promise<void> {

    await this.db.query(
      `
      DELETE
      FROM identity.client_redirect_uris
      WHERE id = $1
      `,
      [id]
    );

  }

  /**
   * Restores a Redirect URI
   * aggregate.
   */
  private restore(
    row: any
  ): ClientRedirectUri {

    return ClientRedirectUri.restore({

      id:
        row.id,

      clientId:
        row.client_id,

      redirectUri:
        RedirectUri.from(
          row.redirect_uri
        ),

      primary:
        row.primary_redirect,

      createdAt:
        row.created_at,

    });

  }

}