import { Pool } from "pg";

import {
  Session,
  SessionRepository,
} from "../../src/session";

interface SessionRow {
  id: string;
  account_id: string;
  created_at: Date;
  expires_at: Date;
  ended_at: Date | null;
}

/**
 * PostgreSQL implementation of
 * SessionRepository.
 */
export class PostgresSessionRepository
  implements SessionRepository {

  constructor(
    private readonly db: Pool
  ) {}

  async create(
    session: Session
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.sessions (
        id,
        account_id,
        created_at,
        expires_at,
        ended_at
      )
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        session.id,
        session.accountId,
        session.createdAt,
        session.expiresAt,
        session.ended(),
      ]
    );
  }

  async update(
    session: Session
  ): Promise<void> {

    await this.db.query(
      `
      UPDATE identity.sessions
      SET
        ended_at = $2
      WHERE id = $1
      `,
      [
        session.id,
        session.ended(),
      ]
    );
  }

  async findById(
    id: string
  ): Promise<Session | null> {

    const result =
      await this.db.query<SessionRow>(
        `
        SELECT *
        FROM identity.sessions
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

  async findByAccountId(
    accountId: string
  ): Promise<Session[]> {

    const result =
      await this.db.query<SessionRow>(
        `
        SELECT *
        FROM identity.sessions
        WHERE account_id = $1
        ORDER BY created_at DESC
        `,
        [accountId]
      );

    return result.rows.map(
      row => this.restore(row)
    );
  }

  async delete(
    id: string
  ): Promise<void> {

    await this.db.query(
      `
      DELETE
      FROM identity.sessions
      WHERE id = $1
      `,
      [id]
    );
  }

  private restore(
    row: SessionRow
  ): Session {

    return Session.restore({
      id: row.id,
      accountId: row.account_id,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      endedAt: row.ended_at,
    });
  }

}