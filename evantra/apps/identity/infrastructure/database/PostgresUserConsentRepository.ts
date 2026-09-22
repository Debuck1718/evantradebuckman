import { Pool } from "pg";

import {
  UserConsent,
  UserConsentRepository,
} from "../../src/authorization";

/**
 * PostgreSQL implementation of the
 * User Consent repository.
 *
 * Table:
 * identity.user_consents
 *
 * A unique index exists on
 * (account_id, client_id, scope), so consent
 * rows are inserted with ON CONFLICT DO
 * NOTHING and never duplicated.
 */
export class PostgresUserConsentRepository
  implements UserConsentRepository {
  constructor(
    private readonly db: Pool,
  ) { }

  /**
   * Stores a new consent.
   *
   * Safe under concurrent authorization
   * requests: a duplicate grant is ignored
   * rather than raising a unique violation.
   */
  async create(
    consent: UserConsent,
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.user_consents (
        id,
        account_id,
        client_id,
        scope,
        granted_at,
        revoked_at
      )
      VALUES ($1,$2,$3,$4,$5,$6)

      ON CONFLICT (account_id, client_id, scope)
      DO NOTHING
      `,
      [
        consent.id,

        consent.accountId,

        consent.clientId,

        consent.scope,

        consent.grantedAt,

        consent.getRevokedAt(),
      ],
    );

  }

  /**
   * Persists the revocation state of an
   * existing consent.
   */
  async update(
    consent: UserConsent,
  ): Promise<void> {

    await this.db.query(
      `
      UPDATE identity.user_consents

      SET
        revoked_at = $2

      WHERE id = $1
      `,
      [
        consent.id,

        consent.getRevokedAt(),
      ],
    );

  }

  /**
   * Finds a consent by its internal
   * identifier.
   */
  async findById(
    id: string,
  ): Promise<UserConsent | null> {

    const result =
      await this.db.query(
        `
        SELECT
          id,
          account_id,
          client_id,
          scope,
          granted_at,
          revoked_at

        FROM identity.user_consents

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
   * Finds a single consent for an
   * account, client and scope.
   */
  async find(
    accountId: string,
    clientId: string,
    scope: string,
  ): Promise<UserConsent | null> {

    const result =
      await this.db.query(
        `
        SELECT
          id,
          account_id,
          client_id,
          scope,
          granted_at,
          revoked_at

        FROM identity.user_consents

        WHERE account_id = $1
          AND client_id = $2
          AND scope = $3

        LIMIT 1
        `,
        [
          accountId,
          clientId,
          scope,
        ],
      );

    if (result.rows.length === 0) {

      return null;

    }

    return this.restore(result.rows[0]);

  }

  /**
   * Returns every consent recorded for
   * an account and client.
   */
  async findByAccountAndClient(
    accountId: string,
    clientId: string,
  ): Promise<UserConsent[]> {

    const result =
      await this.db.query(
        `
        SELECT
          id,
          account_id,
          client_id,
          scope,
          granted_at,
          revoked_at

        FROM identity.user_consents

        WHERE account_id = $1
          AND client_id = $2

        ORDER BY granted_at
        `,
        [
          accountId,
          clientId,
        ],
      );

    return result.rows.map(
      (row) => this.restore(row),
    );

  }

  /**
   * Returns every consent recorded
   * for an account.
   */
  async findByAccountId(
    accountId: string,
  ): Promise<UserConsent[]> {

    const result =
      await this.db.query(
        `
        SELECT
          id,
          account_id,
          client_id,
          scope,
          granted_at,
          revoked_at

        FROM identity.user_consents

        WHERE account_id = $1

        ORDER BY granted_at
        `,
        [accountId],
      );

    return result.rows.map(
      (row) => this.restore(row),
    );

  }

  /**
   * Returns every consent recorded
   * for a client.
   */
  async findByClientId(
    clientId: string,
  ): Promise<UserConsent[]> {

    const result =
      await this.db.query(
        `
        SELECT
          id,
          account_id,
          client_id,
          scope,
          granted_at,
          revoked_at

        FROM identity.user_consents

        WHERE client_id = $1

        ORDER BY granted_at
        `,
        [clientId],
      );

    return result.rows.map(
      (row) => this.restore(row),
    );

  }

  /**
   * Removes a consent.
   */
  async delete(
    id: string,
  ): Promise<void> {

    await this.db.query(
      `
      DELETE FROM identity.user_consents

      WHERE id = $1
      `,
      [id],
    );

  }

  /**
   * Restores a consent aggregate
   * from PostgreSQL.
   */
  private restore(
    row: {
      id: string;
      account_id: string;
      client_id: string;
      scope: string;
      granted_at: Date;
      revoked_at: Date | null;
    },
  ): UserConsent {

    return UserConsent.restore({

      id: row.id,

      accountId: row.account_id,

      clientId: row.client_id,

      scope: row.scope,

      grantedAt: new Date(
        row.granted_at,
      ),

      revokedAt: row.revoked_at
        ? new Date(row.revoked_at)
        : null,

    });

  }

}