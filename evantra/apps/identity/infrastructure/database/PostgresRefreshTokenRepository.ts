import { Pool } from "pg";

import {
  RefreshToken,
  RefreshTokenRepository,
} from "../../src/authorization";

/**
 * PostgreSQL implementation of the
 * Refresh Token repository.
 *
 * Table:
 * identity.refresh_tokens
 */
export class PostgresRefreshTokenRepository
  implements RefreshTokenRepository
{
  constructor(
    private readonly db: Pool,
  ) {}

  /**
   * Stores a new Refresh Token.
   */
  async create(
    token: RefreshToken,
  ): Promise<void> {
    await this.db.query(
      `
      INSERT INTO identity.refresh_tokens (
        id,
        access_token_id,
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
        $8,
        $9
      )
      `,
      [
        token.id,
        token.accessTokenId,
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
   * Persists changes to an existing
   * Refresh Token.
   *
   * Currently the only mutable property
   * is revoked_at.
   */
  async update(
    token: RefreshToken,
  ): Promise<void> {
    await this.db.query(
      `
      UPDATE identity.refresh_tokens

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
   * Finds a Refresh Token by its
   * internal identifier.
   */
  async findById(
    id: string,
  ): Promise<RefreshToken | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        access_token_id,
        account_id,
        client_id,
        token,
        scope,
        expires_at,
        revoked_at,
        created_at

      FROM identity.refresh_tokens

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
   * Finds a Refresh Token using
   * its public token.
   */
  async findByToken(
    token: string,
  ): Promise<RefreshToken | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        access_token_id,
        account_id,
        client_id,
        token,
        scope,
        expires_at,
        revoked_at,
        created_at

      FROM identity.refresh_tokens

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
   * Finds an active Refresh Token.
   *
   * Revoked tokens are excluded at the
   * database level. Expiration is additionally
   * checked by the Token domain model.
   */
  async findActiveByToken(
    token: string,
  ): Promise<RefreshToken | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        access_token_id,
        account_id,
        client_id,
        token,
        scope,
        expires_at,
        revoked_at,
        created_at

      FROM identity.refresh_tokens

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
   * Finds the Refresh Token associated
   * with an Access Token.
   */
  async findByAccessTokenId(
    accessTokenId: string,
  ): Promise<RefreshToken | null> {
    const result = await this.db.query(
      `
      SELECT
        id,
        access_token_id,
        account_id,
        client_id,
        token,
        scope,
        expires_at,
        revoked_at,
        created_at

      FROM identity.refresh_tokens

      WHERE access_token_id = $1

      LIMIT 1
      `,
      [accessTokenId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.restore(result.rows[0]);
  }

  /**
   * Deletes a Refresh Token.
   */
  async delete(
    id: string,
  ): Promise<void> {
    await this.db.query(
      `
      DELETE FROM identity.refresh_tokens

      WHERE id = $1
      `,
      [id],
    );
  }

  /**
   * Restores a Refresh Token aggregate
   * from PostgreSQL.
   */
  private restore(
    row: {
      id: string;
      access_token_id: string;
      account_id: string;
      client_id: string;
      token: string;
      scope: string | null;
      expires_at: Date;
      revoked_at: Date | null;
      created_at: Date;
    },
  ): RefreshToken {
    return RefreshToken.restore({
      id: row.id,

      accessTokenId:
        row.access_token_id,

      accountId:
        row.account_id,

      clientId:
        row.client_id,

      token:
        row.token,

      scopes: (row.scope ?? "")
        .split(/\s+/)
        .filter(Boolean),

      expiresAt:
        new Date(row.expires_at),

      revokedAt:
        row.revoked_at
          ? new Date(row.revoked_at)
          : null,

      createdAt:
        new Date(row.created_at),
    });
  }
}