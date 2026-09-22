import { Pool } from "pg";

import {
  ClientScope,
  ClientScopeRepository,
} from "../../src/client";

/**
 * PostgreSQL implementation of the
 * Client Scope repository.
 *
 * Table:
 * identity.client_scopes
 *
 * A unique index exists on
 * (client_id, scope), so registration uses
 * ON CONFLICT DO NOTHING.
 */
export class PostgresClientScopeRepository
  implements ClientScopeRepository {
  constructor(
    private readonly db: Pool,
  ) { }

  /**
   * Stores a new client scope.
   */
  async create(
    scope: ClientScope,
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.client_scopes (
        id,
        client_id,
        scope,
        created_at
      )
      VALUES ($1,$2,$3,$4)

      ON CONFLICT (client_id, scope)
      DO NOTHING
      `,
      [
        scope.id,

        scope.clientId,

        scope.scope,

        scope.createdAt,
      ],
    );

  }

  /**
   * Finds a scope by its internal
   * identifier.
   */
  async findById(
    id: string,
  ): Promise<ClientScope | null> {

    const result =
      await this.db.query(
        `
        SELECT
          id,
          client_id,
          scope,
          created_at

        FROM identity.client_scopes

        WHERE id = $1

        LIMIT 1
        `,
        [id],
      );

    if (result.rows.length === 0) {

      return null;

    }

    return this.restore(result.rows[0]);

  }

  /**
   * Finds a single scope registered
   * for a client.
   */
  async find(
    clientId: string,
    scope: string,
  ): Promise<ClientScope | null> {

    const result =
      await this.db.query(
        `
        SELECT
          id,
          client_id,
          scope,
          created_at

        FROM identity.client_scopes

        WHERE client_id = $1
          AND scope = $2

        LIMIT 1
        `,
        [
          clientId,
          scope,
        ],
      );

    if (result.rows.length === 0) {

      return null;

    }

    return this.restore(result.rows[0]);

  }

  /**
   * Returns every scope registered
   * for a client.
   */
  async findByClientId(
    clientId: string,
  ): Promise<ClientScope[]> {

    const result =
      await this.db.query(
        `
        SELECT
          id,
          client_id,
          scope,
          created_at

        FROM identity.client_scopes

        WHERE client_id = $1

        ORDER BY created_at
        `,
        [clientId],
      );

    return result.rows.map(
      (row) => this.restore(row),
    );

  }

  /**
   * Removes a scope.
   */
  async delete(
    id: string,
  ): Promise<void> {

    await this.db.query(
      `
      DELETE FROM identity.client_scopes

      WHERE id = $1
      `,
      [id],
    );

  }

  /**
   * Restores a client scope
   * from PostgreSQL.
   */
  private restore(
    row: {
      id: string;
      client_id: string;
      scope: string;
      created_at: Date;
    },
  ): ClientScope {

    return ClientScope.restore({

      id: row.id,

      clientId: row.client_id,

      scope: row.scope,

      createdAt: new Date(
        row.created_at,
      ),

    });

  }

}