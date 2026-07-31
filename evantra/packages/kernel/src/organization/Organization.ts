import { OrganizationProfile } from "./OrganizationProfile";
import { OrganizationStatus } from "./OrganizationStatus";

/**
 * Represents an organization
 * within the Evantra Platform.
 */
export interface Organization {
  /**
   * Unique identifier.
   */
  id: string;

  /**
   * Unique organization slug.
   */
  slug: string;

  /**
   * Lifecycle status.
   */
  status: OrganizationStatus;

  /**
   * Organization profile.
   */
  profile: OrganizationProfile;

  /**
   * Creation date.
   */
  createdAt: Date;

  /**
   * Last update.
   */
  updatedAt: Date;
}