/**
 * Public organization information.
 */
export interface OrganizationProfile {
  /**
   * Display name.
   */
  name: string;

  /**
   * Optional short description.
   */
  description?: string;

  /**
   * Organization logo.
   */
  logoUrl?: string;

  /**
   * Website.
   */
  website?: string;

  /**
   * Country.
   */
  country?: string;

  /**
   * Timezone.
   */
  timezone?: string;
}