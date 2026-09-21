/**
 * Lifecycle state of an announcement.
 */
export enum AnnouncementStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

/**
 * Audience an announcement targets within
 * the organization.
 */
export enum AnnouncementAudience {
  ALL = "ALL",
  ADMINS = "ADMINS",
  MEMBERS = "MEMBERS",
}
