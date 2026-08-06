import { Pool } from "pg";

import {
  AuditAction,
  AuditEvent,
  AuditRepository,
  AuditSeverity,
} from "../../src/audit";

interface AuditRow {

  id: string;

  account_id: string | null;

  action: string;

  severity: string;

  metadata: Record<string, unknown>;

  occurred_at: Date;

}

/**
 * PostgreSQL implementation of
 * AuditRepository.
 */
export class PostgresAuditRepository
  implements AuditRepository {

  constructor(
    private readonly db: Pool,
  ) {}

  async create(
    event: AuditEvent,
  ): Promise<void> {

    await this.db.query(
      `
      INSERT INTO identity.audit_events (

        id,

        account_id,

        action,

        severity,

        metadata,

        occurred_at

      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [

        event.id,

        event.accountId,

        event.action,

        event.severity,

        JSON.stringify(event.metadata),

        event.occurredAt,

      ],
    );

  }

  async findByAccountId(
    accountId: string,
  ): Promise<AuditEvent[]> {

    const result =
      await this.db.query<AuditRow>(
        `
        SELECT *
        FROM identity.audit_events
        WHERE account_id = $1
        ORDER BY occurred_at DESC
        `,
        [accountId],
      );

    return result.rows.map(
      this.restore,
    );

  }

  private restore(
    row: AuditRow,
  ): AuditEvent {

    return AuditEvent.restore({

      id:
        row.id,

      accountId:
        row.account_id,

      action:
        row.action as AuditAction,

      severity:
        row.severity as AuditSeverity,

      metadata:
        row.metadata ?? {},

      occurredAt:
        row.occurred_at,

    });

  }

}