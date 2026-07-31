import { Pool } from "pg";

import {
  Recovery,
  RecoveryRepository,
} from "../../src/recovery";

interface RecoveryRow {
  id: string;
  account_id: string;
  token: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

/**
 * PostgreSQL implementation of
 * RecoveryRepository.
 */
export class PostgresRecoveryRepository
  implements RecoveryRepository {

  constructor(
    private readonly db: Pool
  ) {}

  async create(
    recovery: Recovery
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.recoveries (
        id,
        account_id,
        token,
        expires_at,
        used_at,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        recovery.id,
        recovery.accountId,
        recovery.token,
        recovery.expiresAt,
        recovery.used(),
        recovery.createdAt,
      ]
    );
  }

  async update(
    recovery: Recovery
  ): Promise<void> {

    await this.db.query(
      `
      UPDATE identity.recoveries
      SET
        used_at = $2
      WHERE id = $1
      `,
      [
        recovery.id,
        recovery.used(),
      ]
    );
  }

  async findById(
    id: string
  ): Promise<Recovery | null> {

    const result =
      await this.db.query<RecoveryRow>(
        `
        SELECT *
        FROM identity.recoveries
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
  ): Promise<Recovery | null> {

    const result =
      await this.db.query<RecoveryRow>(
        `
        SELECT *
        FROM identity.recoveries
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
  ): Promise<Recovery | null> {

    const result =
      await this.db.query<RecoveryRow>(
        `
        SELECT *
        FROM identity.recoveries
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
      FROM identity.recoveries
      WHERE id = $1
      `,
      [id]
    );
  }

  private restore(
    row: RecoveryRow
  ): Recovery {

    return Recovery.restore({
      id: row.id,
      accountId: row.account_id,
      token: row.token,
      expiresAt: row.expires_at,
      usedAt: row.used_at,
      createdAt: row.created_at,
    });
  }

}