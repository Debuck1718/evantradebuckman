import { Pool } from "pg";

import {
  EvantraId,
} from "../../src/account";

import {
  BrowserSession,
  BrowserSessionRepository,
} from "../../src/session";

import {
  BrowserSessionMapper,
} from "./BrowserSessionMapper";

import {
  BrowserSessionQueries,
} from "./BrowserSessionQueries";

import {
  BrowserSessionRow,
} from "./BrowserSessionRow";

/**
 * PostgreSQL implementation of the
 * Browser Session repository.
 */
export class PostgresBrowserSessionRepository
  implements BrowserSessionRepository {

  constructor(

    private readonly db: Pool,

  ) {}

  /**
   * Persists a Browser Session.
   */
  async create(
    session: BrowserSession,
  ): Promise<void> {

    const row =
      BrowserSessionMapper.toRow(
        session,
      );

    await this.db.query(

  BrowserSessionQueries.CREATE,

  [

    row.id,

    row.session_id,
    row.account_id,
    row.evantra_id,
    row.client_id,
    row.application_id,
    row.organization_id,
    row.workspace_id,
    row.tenant_id,

    row.authentication_method,
    row.authentication_level,
    row.authenticated_at,
    row.mfa_verified,
    row.step_up_required,
    row.verified,

    row.device_id,
    row.fingerprint,
    row.device_name,
    row.device_type,
    row.operating_system,
    row.operating_system_version,
    row.browser,
    row.browser_version,
    row.platform,
    row.trusted,
    row.device_verified,
    row.last_seen_at,

    row.ip_address,
    row.forwarded_ip_address,
    row.country,
    row.region,
    row.city,
    row.internet_service_provider,
    row.autonomous_system_number,
    row.network_type,
    row.vpn_detected,
    row.proxy_detected,
    row.tor_detected,

    row.trust_level,
    row.remember_me,
    row.locked,
    row.continuous_validation,
    row.cookie_version,
    row.key_version,
    row.session_version,

    row.status,
    row.created_at,
    row.last_activity_at,
    row.idle_timeout_at,
    row.expires_at,
    row.revoked_at,
    row.terminated_at,
    row.updated_at,

  ],

);

  }

  /**
   * Updates a Browser Session.
   */
  async update(
    session: BrowserSession,
  ): Promise<void> {

    const row =
      BrowserSessionMapper.toRow(
        session,
      );

    await this.db.query(

      BrowserSessionQueries.UPDATE,

      [

  row.id,

  row.trust_level,
  row.remember_me,
  row.locked,
  row.continuous_validation,
  row.cookie_version,
  row.key_version,
  row.session_version,

  row.mfa_verified,
  row.step_up_required,
  row.verified,

  row.trusted,
  row.device_verified,
  row.fingerprint,
  row.device_name,
  row.last_seen_at,

  row.ip_address,
  row.forwarded_ip_address,
  row.country,
  row.region,
  row.city,
  row.internet_service_provider,
  row.autonomous_system_number,
  row.network_type,
  row.vpn_detected,
  row.proxy_detected,
  row.tor_detected,

  row.status,
  row.last_activity_at,
  row.idle_timeout_at,
  row.expires_at,
  row.revoked_at,
  row.terminated_at,
  row.updated_at,

],

    );

  }

  /**
   * Deletes a Browser Session.
   */
  async delete(
    id: string,
  ): Promise<void> {

    await this.db.query(

      BrowserSessionQueries.DELETE,

      [

        id,

      ],

    );

  }

  /**
   * Finds a Browser Session
   * by its internal identifier.
   */
  async findById(
  id: string,
): Promise<BrowserSession | null> {

  const result =
    await this.db.query<BrowserSessionRow>(

      BrowserSessionQueries.FIND_BY_ID,

      [id],

    );

  const row = result.rows[0];

  if (!row) {

    return null;

  }

  return BrowserSessionMapper.toDomain(

    row,

  );

}

  /**
   * Finds a Browser Session
   * by its session identifier.
   */
  async findBySessionId(
  sessionId: string,
): Promise<BrowserSession | null> {

  const result =
    await this.db.query<BrowserSessionRow>(

      BrowserSessionQueries.FIND_BY_SESSION_ID,

      [sessionId],

    );

  const row = result.rows[0];

  if (!row) {

    return null;

  }

  return BrowserSessionMapper.toDomain(

    row,

  );

}

  /**
   * Returns all Browser Sessions
   * owned by an account.
   */
  async findByAccountId(
    accountId: string,
  ): Promise<BrowserSession[]> {

    const result =
      await this.db.query<BrowserSessionRow>(

        BrowserSessionQueries.FIND_BY_ACCOUNT_ID,

        [

          accountId,

        ],

      );

    return result.rows.map(

      BrowserSessionMapper.toDomain,

    );

  }

  /**
   * Returns all Browser Sessions
   * owned by an Evantra ID.
   */
  async findByEvantraId(
  evantraId: EvantraId,
): Promise<BrowserSession[]> {

    const result =
      await this.db.query<BrowserSessionRow>(

        BrowserSessionQueries.FIND_BY_EVANTRA_ID,

        [

          evantraId.value(),

        ],

      );

    return result.rows.map(

      BrowserSessionMapper.toDomain,

    );

  }

  /**
 * Returns every Browser Session
 * belonging to an OAuth Client.
 */
async findByClientId(
  clientId: string,
): Promise<BrowserSession[]> {

  const result =
    await this.db.query<BrowserSessionRow>(

      BrowserSessionQueries.FIND_BY_CLIENT_ID,

      [

        clientId,

      ],

    );

  return result.rows.map(

    BrowserSessionMapper.toDomain,

  );

}

}