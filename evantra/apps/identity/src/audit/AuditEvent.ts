import { AuditAction } from "./AuditAction";
import { AuditSeverity } from "./AuditSeverity";

/**
 * Represents a security audit event.
 */
export class AuditEvent {

  private constructor(

    public readonly id: string,

    public readonly accountId: string | null,

    public readonly action: AuditAction,

    public readonly severity: AuditSeverity,

    public readonly metadata: Record<string, unknown>,

    public readonly occurredAt: Date,

  ) {}

  /**
   * Creates a new audit event.
   */
  static create(params: {

    id: string;

    accountId: string | null;

    action: AuditAction;

    severity: AuditSeverity;

    metadata?: Record<string, unknown>;

  }): AuditEvent {

    return new AuditEvent(

      params.id,

      params.accountId,

      params.action,

      params.severity,

      params.metadata ?? {},

      new Date(),

    );

  }

  /**
   * Restores an audit event.
   */
  static restore(params: {

    id: string;

    accountId: string | null;

    action: AuditAction;

    severity: AuditSeverity;

    metadata: Record<string, unknown>;

    occurredAt: Date;

  }): AuditEvent {

    return new AuditEvent(

      params.id,

      params.accountId,

      params.action,

      params.severity,

      params.metadata,

      new Date(params.occurredAt),

    );

  }

}