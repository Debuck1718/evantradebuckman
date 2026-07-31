/**
 * Generates OAuth
 * Authorization Codes.
 *
 * Authorization Codes are
 * short-lived credentials
 * exchanged for tokens.
 */
export interface AuthorizationCodeGenerator {

  /**
   * Generates a new
   * Authorization Code.
   */
  generate(): Promise<string>;

}