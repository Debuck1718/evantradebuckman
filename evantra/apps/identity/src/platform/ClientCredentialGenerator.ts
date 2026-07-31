/**
 * Generates OAuth Client
 * credentials.
 */
export interface ClientCredentialGenerator {

  /**
   * Generates a public
   * Client ID.
   */
  clientId(): string;

  /**
   * Generates the plain-text
   * Client Secret.
   *
   * The returned value is shown
   * only once to the developer.
   */
  clientSecret(): string;

}