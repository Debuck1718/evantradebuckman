import { Pool } from "pg";

import {
  AuthorizationCode,
  AuthorizationCodeRepository,
  PkceMethod,
} from "../../src/authorization";

import {
  RedirectUri,
} from "../../src/client";

/**
 * PostgreSQL implementation of the
 * Authorization Code repository.
 *
 * Table:
 * identity.authorization_codes
 */
export class PostgresAuthorizationCodeRepository
  implements AuthorizationCodeRepository
{
  constructor(
    private readonly db: Pool,
  ) {}

  /**
   * Stores a new Authorization Code.
   */
  async create(
    code: AuthorizationCode,
  ): Promise<void> {
    await this.db.query(
      `
      INSERT INTO identity.authorization_codes (

        id,
        client_id,
        account_id,
        code,
        code_challenge,
        code_challenge_method,
        redirect_uri,
        scope,
        expires_at,
        consumed_at,
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
        $9,
        $10,
        $11
      )
      `,
      [
        code.id,

        code.clientId,

        code.accountId,

        code.code,

        code.codeChallenge,

        code.codeChallengeMethod,

        code.redirectUri.value(),

        code.scopes().join(" "),

        code.expiresAt,

        code.consumed(),

        code.createdAt,
      ],
    );
  }

  /**
   * Persists changes to an
   * existing Authorization Code.
   *
   * Currently the only mutable
   * property is consumed_at.
   */
  async update(
    code: AuthorizationCode,
  ): Promise<void> {
    await this.db.query(
      `
      UPDATE identity.authorization_codes

      SET
        consumed_at = $2

      WHERE id = $1
      `,
      [
        code.id,

        code.consumed(),
      ],
    );
  }

  /**
   * Finds an Authorization Code
   * by its internal identifier.
   */
  async findById(
    id: string,
  ): Promise<AuthorizationCode | null> {
    const result =
      await this.db.query(
        `
        SELECT
          id,
          client_id,
          account_id,
          code,
          code_challenge,
          code_challenge_method,
          redirect_uri,
          scope,
          expires_at,
          consumed_at,
          created_at

        FROM identity.authorization_codes

        WHERE id = $1

        LIMIT 1
        `,
        [id],
      );

    if (result.rows.length === 0) {
      return null;
    }

    return this.restore(
      result.rows[0],
    );
  }

  /**
   * Finds an Authorization Code
   * using its public code.
   */
  async findByCode(
    code: string,
  ): Promise<AuthorizationCode | null> {
    const result =
      await this.db.query(
        `
        SELECT
          id,
          client_id,
          account_id,
          code,
          code_challenge,
          code_challenge_method,
          redirect_uri,
          scope,
          expires_at,
          consumed_at,
          created_at

        FROM identity.authorization_codes

        WHERE code = $1

        LIMIT 1
        `,
        [code],
      );

    if (result.rows.length === 0) {
      return null;
    }

    return this.restore(
      result.rows[0],
    );
  }

  /**
   * Finds an active Authorization Code
   * using its public code.
   *
   * Active here means the code has
   * not yet been consumed.
   */
  async findActiveByCode(
    code: string,
  ): Promise<AuthorizationCode | null> {
    const result =
      await this.db.query(
        `
        SELECT
          id,
          client_id,
          account_id,
          code,
          code_challenge,
          code_challenge_method,
          redirect_uri,
          scope,
          expires_at,
          consumed_at,
          created_at

        FROM identity.authorization_codes

        WHERE code = $1

          AND consumed_at IS NULL

        LIMIT 1
        `,
        [code],
      );

    if (result.rows.length === 0) {
      return null;
    }

    return this.restore(
      result.rows[0],
    );
  }

  /**
   * Deletes an Authorization Code.
   */
  async delete(
    id: string,
  ): Promise<void> {
    await this.db.query(
      `
      DELETE FROM identity.authorization_codes

      WHERE id = $1
      `,
      [id],
    );
  }

  /**
   * Restores an Authorization Code
   * aggregate from PostgreSQL.
   */
  private restore(
    row: {
      id: string;
      client_id: string;
      account_id: string;
      code: string;
      code_challenge: string;
      code_challenge_method: string;
      redirect_uri: string;
      scope: string | null;
      expires_at: Date;
      consumed_at: Date | null;
      created_at: Date;
    },
  ): AuthorizationCode {
    return AuthorizationCode.restore({
      id: row.id,

      clientId: row.client_id,

      accountId: row.account_id,

      redirectUri: RedirectUri.from(
        row.redirect_uri
      ),

      code: row.code,

      codeChallenge: row.code_challenge,

      codeChallengeMethod: row.code_challenge_method as PkceMethod,

      scopes: (row.scope ?? "")
        .split(/\s+/)
        .filter(Boolean),

      expiresAt: new Date(
        row.expires_at
      ),

      consumedAt: row.consumed_at
        ? new Date(
          row.consumed_at
        )
        : null,

      createdAt: new Date(
        row.created_at
      ),
      nonce: null
    });
  }
}