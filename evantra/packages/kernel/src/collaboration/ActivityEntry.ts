import { ActivityType } from "./ActivityType";

/**
 * An auditable entry in an organization's
 * activity feed. Immutable once created.
 */
export interface ActivityEntry {
  readonly id: string;
  readonly organizationId: string;
  readonly actorId: string;
  type: ActivityType;
  summary: string;
  metadata: Record<string, unknown>;
  readonly createdAt: string;
}
