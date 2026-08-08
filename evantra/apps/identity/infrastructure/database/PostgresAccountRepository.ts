import { Pool } from "pg";

import {
  Account,
  AccountRepository,
  AccountStatus,
  ContactEmail,
  EvantraId,
} from "../../src/account";

/**
 * Represents an Account row
 * returned from PostgreSQL.
 */
interface AccountRow {

  id: string;

  first_name: string;

  last_name: string;

  evantra_id: string;

  contact_email: string;

  status: AccountStatus;

  created_at: Date;

  updated_at: Date;

}

/**
 * PostgreSQL implementation of
 * the Account repository.
 */
export class PostgresAccountRepository
  implements AccountRepository {

  constructor(
    private readonly db: Pool,
  ) {}

  /**
   * Creates a new account.
   */
  async create(
    account: Account,
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.accounts (
        id,
        first_name,
        last_name,
        evantra_id,
        contact_email,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        account.id,
        account.firstName,
        account.lastName,
        account.evantraId.value(),
        account.contactEmail.value(),
        account.getStatus(),
        account.createdAt,
        account.updated(),
      ],
    );
  }

  /**
   * Updates an existing account.
   */
  async update(
    account: Account,
  ): Promise<void> {

    await this.db.query(
      `
      UPDATE identity.accounts
      SET
        first_name = $2,
        last_name = $3,
        contact_email = $4,
        status = $5,
        updated_at = $6
      WHERE id = $1
      `,
      [
        account.id,
        account.firstName,
        account.lastName,
        account.contactEmail.value(),
        account.getStatus(),
        account.updated(),
      ],
    );
  }

  /**
   * Finds an account by ID.
   */
  async findById(
    id: string,
  ): Promise<Account | null> {

    const result =
      await this.db.query<AccountRow>(
        `
        SELECT *
        FROM identity.accounts
        WHERE id = $1
        LIMIT 1
        `,
        [id],
      );

    if (
      result.rows.length === 0
    ) {
      return null;
    }

    const row =
      result.rows[0]!;

    return this.restore(row);
  }

  /**
   * Finds an account using its
   * Evantra ID.
   */
  async findByEvantraId(
    evantraId: EvantraId,
  ): Promise<Account | null> {

    const result =
      await this.db.query<AccountRow>(
        `
        SELECT *
        FROM identity.accounts
        WHERE evantra_id = $1
        LIMIT 1
        `,
        [evantraId.value()],
      );

    if (
      result.rows.length === 0
    ) {
      return null;
    }

    const row =
      result.rows[0]!;

    return this.restore(row);
  }

  /**
   * Finds an account using its
   * contact email.
   */
  async findByContactEmail(
    contactEmail: ContactEmail,
  ): Promise<Account | null> {

    const result =
      await this.db.query<AccountRow>(
        `
        SELECT *
        FROM identity.accounts
        WHERE contact_email = $1
        LIMIT 1
        `,
        [contactEmail.value()],
      );

    if (
      result.rows.length === 0
    ) {
      return null;
    }

    const row =
      result.rows[0]!;

    return this.restore(row);
  }

  /**
   * Deletes an account.
   */
  async delete(
    id: string,
  ): Promise<void> {

    await this.db.query(
      `
      DELETE
      FROM identity.accounts
      WHERE id = $1
      `,
      [id],
    );
  }

  /**
   * Restores an Account aggregate
   * from PostgreSQL.
   */
  private restore(
    row: AccountRow,
  ): Account {

    return Account.restore({

      id:
        row.id,

      firstName:
        row.first_name,

      lastName:
        row.last_name,

      evantraId:
        EvantraId.from(
          row.evantra_id,
        ),

      contactEmail:
        ContactEmail.from(
          row.contact_email,
        ),

      status:
        row.status,

      createdAt:
        row.created_at,

      updatedAt:
        row.updated_at,

    });
  }
}