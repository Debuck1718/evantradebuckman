import { AuditEvent } from "./AuditEvent";

export interface AuditRepository {

  create(
    event: AuditEvent,
  ): Promise<void>;

  findByAccountId(
    accountId: string,
  ): Promise<AuditEvent[]>;

}