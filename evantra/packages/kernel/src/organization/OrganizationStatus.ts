/**
 * Lifecycle state of an organization.
 */
export enum OrganizationStatus {
  /**
   * Organization has been created
   * but is not yet active.
   */
  PENDING = "PENDING",

  /**
   * Organization is active.
   */
  ACTIVE = "ACTIVE",

  /**
   * Organization has been suspended.
   */
  SUSPENDED = "SUSPENDED",

  /**
   * Organization has been archived.
   */
  ARCHIVED = "ARCHIVED",
}