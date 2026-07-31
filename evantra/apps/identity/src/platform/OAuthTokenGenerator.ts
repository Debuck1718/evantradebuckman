/**
 * Generates OAuth tokens.
 *
 * Implementations may issue
 * opaque tokens or JWTs.
 */
export interface OAuthTokenGenerator {

  /**
   * Generates an Access Token.
   */
  accessToken(): string;

  /**
   * Generates a Refresh Token.
   */
  refreshToken(): string;

}