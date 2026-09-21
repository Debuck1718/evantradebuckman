import { AnnouncementAudience } from "./AnnouncementStatus";

/**
 * An official broadcast from organization owners/admins
 * to their members — news, policy changes, milestones.
 */
export interface Announcement {
  readonly id: string;
  readonly organizationId: string;
  readonly authorId: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  status: AnnouncementStatusEnum;
  publishedAt: string | null;
  readonly createdAt: string;
  updatedAt: string;
}

/**
 * Re-exported to avoid circular import awkwardness
 * while keeping one canonical enum source.
 */
import { AnnouncementStatus as AnnouncementStatusEnum } from "./AnnouncementStatus";
