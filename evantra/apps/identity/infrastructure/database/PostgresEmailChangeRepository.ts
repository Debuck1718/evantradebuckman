import { Pool } from "pg";

import {
  EmailChange,
  EmailChangeRepository,
} from "../../src/emailChange";

interface EmailChangeRow {
  id: string;
  account_id: string;
  new_contact_email: string;
  token: string;
  expires_at: Date;
  verified_at: Date | null;
  created_at: Date;
}

/**
 * PostgreSQL implementation of
 * EmailChangeRepository.
 */
export class PostgresEmailChangeRepository
  implements EmailChangeRepository {

  constructor(
    private readonly db: Pool,
  ) {}

  async create(
    request: EmailChange,
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.email_changes (
        id,
        account_id,
        new_contact_email,
        token,
        expires_at,
        verified_at,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        request.id,
        request.accountId,
        request.newContactEmail,
        request.token,
        request.expiresAt,
        request.verifiedAtDate(),
        request.createdAt,
      ],
    );

  }

  async update(
    request: EmailChange,
  ): Promise<void> {

    await this.db.query(
      `
      UPDATE identity.email_changes
      SET
        verified_at = $2
      WHERE id = $1
      `,
      [
        request.id,
        request.verifiedAtDate(),
      ],
    );

  }

  async findById(
    id: string,
  ): Promise<EmailChange | null> {

    const result =
      await this.db.query<EmailChangeRow>(
        `
        SELECT *
        FROM identity.email_changes
        WHERE id = $1
        LIMIT 1
        `,
        [id],
      );

    if (result.rows.length === 0) {
      return null;
    }

    return this.restore(
      result.rows[0]!,
    );

  }

  async findByToken(
    token: string,
  ): Promise<EmailChange | null> {

    const result =
      await this.db.query<EmailChangeRow>(
        `
        SELECT *
        FROM identity.email_changes
        WHERE token = $1
        LIMIT 1
        `,
        [token],
      );

    if (result.rows.length === 0) {
      return null;
    }

    return this.restore(
      result.rows[0]!,
    );

  }

  async findByAccountId(
    accountId: string,
  ): Promise<EmailChange | null> {

    const result =
      await this.db.query<EmailChangeRow>(
        `
        SELECT *
        FROM identity.email_changes
        WHERE account_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [accountId],
      );

    if (result.rows.length === 0) {
      return null;
    }

    return this.restore(
      result.rows[0]!,
    );

  }

  async delete(
    id: string,
  ): Promise<void> {

    await this.db.query(
      `
      DELETE
      FROM identity.email_changes
      WHERE id = $1
      `,
      [id],
    );

  }

  private restore(
    row: EmailChangeRow,
  ): EmailChange {

    return EmailChange.restore({

      id:
        row.id,

      accountId:
        row.account_id,

      newContactEmail:
        row.new_contact_email,

      token:
        row.token,

      expiresAt:
        row.expires_at,

      verifiedAt:
        row.verified_at,

      createdAt:
        row.created_at,

    });

  }

}