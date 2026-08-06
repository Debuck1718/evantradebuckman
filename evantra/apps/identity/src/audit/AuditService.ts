import { AuditAction } from "./AuditAction";
import { AuditEvent } from "./AuditEvent";
import { AuditRepository } from "./AuditRepository";
import { AuditSeverity } from "./AuditSeverity";
import { Clock } from "../platform/Clock";
import { IdGenerator } from "../platform/IdGenerator";

export class AuditService {

  constructor(

    private readonly repository: AuditRepository,

    private readonly ids: IdGenerator,

    private readonly clock: Clock,

  ) {}

  async record(params: {

    accountId: string | null;

    action: AuditAction;

    severity: AuditSeverity;

    metadata?: Record<string, unknown>;

  }): Promise<void> {

    const event =
      AuditEvent.create({

        id:
          this.ids.auditEvent(),

        accountId:
          params.accountId,

        action:
          params.action,

        severity:
          params.severity,

        ...(params.metadata !== undefined && { metadata: params.metadata }),

      });

    await this.repository.create(event);

  }

}