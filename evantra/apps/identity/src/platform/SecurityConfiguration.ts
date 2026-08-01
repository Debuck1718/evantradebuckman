/**
 * Central security configuration
 * for Evantra Identity.
 *
 * Every security-sensitive policy
 * is defined here instead of being
 * hardcoded throughout the system.
 */
export interface SecurityConfiguration {

  /**
   * OAuth Authorization Code
   * lifetime (milliseconds).
   */
  authorizationCodeLifetime: number;

  /**
   * OAuth Access Token
   * lifetime (milliseconds).
   */
  accessTokenLifetime: number;

  /**
   * OAuth Refresh Token
   * lifetime (milliseconds).
   */
  refreshTokenLifetime: number;

  /**
   * User session lifetime.
   */
  sessionLifetime: number;

  /**
   * Verification token lifetime.
   */
  verificationLifetime: number;

  /**
   * Password recovery token lifetime.
   */
  recoveryLifetime: number;

  /**
   * Maximum failed login attempts
   * before account lock.
   */
  maxFailedLoginAttempts: number;

  /**
   * Account lock duration.
   */
  accountLockDuration: number;

  /**
   * Require PKCE for OAuth
   * Authorization Code flow.
   */
  requirePkce: boolean;

  /**
   * Only allow HTTPS redirect URIs
   * for third-party applications.
   */
  requireHttpsRedirectUris: boolean;

}