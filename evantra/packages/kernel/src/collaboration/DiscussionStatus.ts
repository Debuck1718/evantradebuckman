/**
 * Visibility of a discussion thread
 * within an organization.
 */
export enum DiscussionVisibility {
  /**
   * Visible to all organization members.
   */
  ORGANIZATION = "ORGANIZATION",

  /**
   * Visible only to invited participants.
   */
  RESTRICTED = "RESTRICTED",
}

/**
 * Lifecycle state of a discussion thread.
 */
export enum DiscussionStatus {
  OPEN = "OPEN",
  RESOLVED = "RESOLVED",
  LOCKED = "LOCKED",
  ARCHIVED = "ARCHIVED",
}
