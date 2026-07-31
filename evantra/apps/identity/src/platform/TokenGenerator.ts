/**
 * Generates cryptographically
 * secure tokens used throughout
 * the Evantra Identity Platform.
 *
 * Tokens are different from IDs.
 *
 * IDs uniquely identify persisted
 * entities, while tokens are
 * exchanged during authentication
 * and authorization workflows.
 */
export interface TokenGenerator {

  /**
   * Generates an email
   * verification token.
   */
  verification(): string;

  /**
   * Generates a password
   * recovery token.
   */
  recovery(): string;

  /**
   * Generates an OAuth 2.1
   * Authorization Code.
   */
  authorizationCode(): string;

  /**
   * Generates an OAuth 2.1
   * Access Token.
   */
  accessToken(): string;

  /**
   * Generates an OAuth 2.1
   * Refresh Token.
   */
  refreshToken(): string;

}