import { Pool } from "pg";

import {
  LoginAttempt,
  LoginAttemptRepository,
} from "../../src/loginAttempt";

interface LoginAttemptRow {

  evantra_id: string;

  attempts: number;

  locked_until: Date | null;

  last_attempt_at: Date;

}

/**
 * PostgreSQL implementation of
 * LoginAttemptRepository.
 */
export class PostgresLoginAttemptRepository
  implements LoginAttemptRepository {

  constructor(
    private readonly db: Pool,
  ) {}

  async create(
    attempt: LoginAttempt,
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.login_attempts (

        evantra_id,

        attempts,

        locked_until,

        last_attempt_at

      )
      VALUES ($1,$2,$3,$4)
      `,
      [

        attempt.evantraId,

        attempt.getAttempts(),

        attempt.getLockedUntil(),

        attempt.getLastAttemptAt(),

      ],
    );

  }

  async update(
    attempt: LoginAttempt,
  ): Promise<void> {

    await this.db.query(
      `
      UPDATE identity.login_attempts
      SET

        attempts = $2,

        locked_until = $3,

        last_attempt_at = $4

      WHERE evantra_id = $1
      `,
      [

        attempt.evantraId,

        attempt.getAttempts(),

        attempt.getLockedUntil(),

        attempt.getLastAttemptAt(),

      ],
    );

  }

  async findByEvantraId(
    evantraId: string,
  ): Promise<LoginAttempt | null> {

    const result =
      await this.db.query<LoginAttemptRow>(
        `
        SELECT *
        FROM identity.login_attempts
        WHERE evantra_id = $1
        LIMIT 1
        `,
        [evantraId],
      );

    if (result.rows.length === 0) {

      return null;

    }

    const row = result.rows[0]!;

    return LoginAttempt.restore({

      evantraId:
        row.evantra_id,

      attempts:
        row.attempts,

      lockedUntil:
        row.locked_until,

      lastAttemptAt:
        row.last_attempt_at,

    });

  }

  async delete(
    evantraId: string,
  ): Promise<void> {

    await this.db.query(
      `
      DELETE
      FROM identity.login_attempts
      WHERE evantra_id = $1
      `,
      [evantraId],
    );

  }

}