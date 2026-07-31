import { Pool } from "pg";

import {
  Credential,
  CredentialRepository,
} from "../../src/authentication";

interface CredentialRow {
  account_id: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * PostgreSQL implementation of
 * CredentialRepository.
 */
export class PostgresCredentialRepository
  implements CredentialRepository {

  constructor(
    private readonly db: Pool
  ) {}

  /**
   * Creates a credential.
   */
  async create(
    credential: Credential
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.credentials (
        account_id,
        password_hash,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        credential.accountId,
        credential.hash(),
        credential.createdAt,
        credential.updated(),
      ]
    );
  }

  /**
   * Updates a credential.
   */
  async update(
    credential: Credential
  ): Promise<void> {

    await this.db.query(
      `
      UPDATE identity.credentials
      SET
        password_hash = $2,
        updated_at = $3
      WHERE account_id = $1
      `,
      [
        credential.accountId,
        credential.hash(),
        credential.updated(),
      ]
    );
  }

  /**
   * Finds a credential.
   */
  async findByAccountId(
    accountId: string
  ): Promise<Credential | null> {

    const result =
      await this.db.query<CredentialRow>(
        `
        SELECT *
        FROM identity.credentials
        WHERE account_id = $1
        LIMIT 1
        `,
        [accountId]
      );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0]!;

    return this.restore(row);
  }

  /**
   * Deletes a credential.
   */
  async delete(
    accountId: string
  ): Promise<void> {

    await this.db.query(
      `
      DELETE
      FROM identity.credentials
      WHERE account_id = $1
      `,
      [accountId]
    );
  }

  /**
   * Restores a Credential
   * from PostgreSQL.
   */
  private restore(
    row: CredentialRow
  ): Credential {

    return Credential.restore({
      accountId: row.account_id,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

}