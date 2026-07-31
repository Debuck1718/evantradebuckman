import { Pool } from "pg";

import {
  Verification,
  VerificationRepository,
} from "../../src/verification";

interface VerificationRow {
  id: string;
  account_id: string;
  token: string;
  expires_at: Date;
  verified_at: Date | null;
  created_at: Date;
}

/**
 * PostgreSQL implementation of
 * VerificationRepository.
 */
export class PostgresVerificationRepository
  implements VerificationRepository {

  constructor(
    private readonly db: Pool
  ) {}

  async create(
    verification: Verification
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.verifications (
        id,
        account_id,
        token,
        expires_at,
        verified_at,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        verification.id,
        verification.accountId,
        verification.token,
        verification.expiresAt,
        verification.verified(),
        verification.createdAt,
      ]
    );
  }

  async update(
    verification: Verification
  ): Promise<void> {

    await this.db.query(
      `
      UPDATE identity.verifications
      SET
        verified_at = $2
      WHERE id = $1
      `,
      [
        verification.id,
        verification.verified(),
      ]
    );
  }

  async findById(
    id: string
  ): Promise<Verification | null> {

    const result =
      await this.db.query<VerificationRow>(
        `
        SELECT *
        FROM identity.verifications
        WHERE id = $1
        LIMIT 1
        `,
        [id]
      );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0]!;

    return this.restore(row);
  }

  async findByToken(
    token: string
  ): Promise<Verification | null> {

    const result =
      await this.db.query<VerificationRow>(
        `
        SELECT *
        FROM identity.verifications
        WHERE token = $1
        LIMIT 1
        `,
        [token]
      );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0]!;

    return this.restore(row);
  }

  async findByAccountId(
    accountId: string
  ): Promise<Verification | null> {

    const result =
      await this.db.query<VerificationRow>(
        `
        SELECT *
        FROM identity.verifications
        WHERE account_id = $1
        ORDER BY created_at DESC
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

  async delete(
    id: string
  ): Promise<void> {

    await this.db.query(
      `
      DELETE
      FROM identity.verifications
      WHERE id = $1
      `,
      [id]
    );
  }

  private restore(
    row: VerificationRow
  ): Verification {

    return Verification.restore({
      id: row.id,
      accountId: row.account_id,
      token: row.token,
      expiresAt: row.expires_at,
      verifiedAt: row.verified_at,
      createdAt: row.created_at,
    });
  }

}