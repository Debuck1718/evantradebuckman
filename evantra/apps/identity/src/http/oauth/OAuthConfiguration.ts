/**
 * OAuth configuration used by
 * HTTP grant handlers.
 */
export interface OAuthConfiguration {

  /**
   * Access Token lifetime
   * in milliseconds.
   */
  accessTokenLifetime: number;

  /**
   * Refresh Token lifetime
   * in milliseconds.
   */
  refreshTokenLifetime: number;

}