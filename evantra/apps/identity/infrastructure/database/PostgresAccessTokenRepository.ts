import { Pool } from "pg";

import {
  AccessToken,
  AccessTokenRepository,
} from "../../src/authorization";

/**
 * PostgreSQL implementation of the
 * Access Token repository.
 *
 * Table:
 * identity.access_tokens
 */
export class PostgresAccessTokenRepository
  implements AccessTokenRepository
{
  constructor(
    private readonly db: Pool,
  ) {}

  /**
   * Stores a new Access Token.
   */
  async create(
    token: AccessToken,
  ): Promise<void> {
    await this.db.query(
      `
      INSERT INTO identity.access_tokens (
        id,
        account_id,
        client_id,
        token,
        scope,
        expires_at,
        revoked_at,
        created_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      )
      `,
      [
        token.id,
        token.accountId,
        token.clientId,
        token.token,
        token.scopes().join(" "),
        token.expiresAt,
        token.revoked(),
        token.createdAt,
      ],
    );
  }

  /**
   * Persists changes to an existing Access Token.
   *
   * Currently the only mutable property
   * is revoked_at.
   */
  async update(
    token: AccessToken,
  ): Promise<void> {
    await this.db.query(
      `
      UPDATE identity.access_tokens

      SET
        revoked_at = $2

      WHERE id = $1
      `,
      [
        token.id,
        token.revoked(),
      ],
    );
  }

  /**
   * Finds an Access Token by its
   * internal identifier.
   */
  async findById(
    id: string,
  ): Promise<AccessToken | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        account_id,
        client_id,
        token,
        scope,
        expires_at,
        revoked_at,
        created_at

      FROM identity.access_tokens

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
   * Finds an Access Token using
   * its public token.
   */
  async findByToken(
    token: string,
  ): Promise<AccessToken | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        account_id,
        client_id,
        token,
        scope,
        expires_at,
        revoked_at,
        created_at

      FROM identity.access_tokens

      WHERE token = $1

      LIMIT 1
      `,
      [token],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.restore(result.rows[0]);
  }

  /**
   * Finds an active Access Token.
   *
   * Revoked tokens are excluded at the
   * database level. Expiration is additionally
   * checked by the Token domain model.
   */
  async findActiveByToken(
    token: string,
  ): Promise<AccessToken | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        account_id,
        client_id,
        token,
        scope,
        expires_at,
        revoked_at,
        created_at

      FROM identity.access_tokens

      WHERE token = $1
        AND revoked_at IS NULL

      LIMIT 1
      `,
      [token],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.restore(result.rows[0]);
  }

  /**
   * Deletes an Access Token.
   */
  async delete(
    id: string,
  ): Promise<void> {
    await this.db.query(
      `
      DELETE FROM identity.access_tokens

      WHERE id = $1
      `,
      [id],
    );
  }

  /**
   * Restores an Access Token aggregate
   * from PostgreSQL.
   */
  private restore(
    row: {
      id: string;
      account_id: string;
      client_id: string;
      token: string;
      scope: string | null;
      expires_at: Date;
      revoked_at: Date | null;
      created_at: Date;
    },
  ): AccessToken {
    return AccessToken.restore({
      id: row.id,

      accountId: row.account_id,

      clientId: row.client_id,

      token: row.token,

      scopes: (row.scope ?? "")
        .split(/\s+/)
        .filter(Boolean),

      expiresAt: new Date(
        row.expires_at,
      ),

      revokedAt: row.revoked_at
        ? new Date(row.revoked_at)
        : null,

      createdAt: new Date(
        row.created_at,
      ),
    });
  }
}