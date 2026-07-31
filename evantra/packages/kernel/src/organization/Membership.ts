import { MembershipStatus } from "./MembershipStatus";

/**
 * Links a user to
 * an organization.
 */
export interface Membership {
  /**
   * Membership identifier.
   */
  id: string;

  /**
   * User identifier.
   */
  userId: string;

  /**
   * Organization identifier.
   */
  organizationId: string;

  /**
   * Assigned roles.
   */
  roleIds: readonly string[];

  /**
   * Membership status.
   */
  status: MembershipStatus;

  /**
   * Join date.
   */
  joinedAt: Date;
}