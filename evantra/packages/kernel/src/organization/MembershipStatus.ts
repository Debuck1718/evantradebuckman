/**
 * Status of a user's membership
 * within an organization.
 */
export enum MembershipStatus {
  /**
   * Invitation sent.
   */
  INVITED = "INVITED",

  /**
   * User accepted.
   */
  ACTIVE = "ACTIVE",

  /**
   * Membership suspended.
   */
  SUSPENDED = "SUSPENDED",

  /**
   * User left organization.
   */
  LEFT = "LEFT",
}