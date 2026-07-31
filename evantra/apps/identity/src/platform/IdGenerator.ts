/**
 * Generates unique identifiers
 * used by the Identity platform.
 */
export interface IdGenerator {

  account(): string;

  verification(): string;

  session(): string;

  recovery(): string;

  client(): string;

  redirectUri(): string;

  clientScope(): string;

  userConsent(): string;

  authorizationCode(): string;

  accessToken(): string;

  refreshToken(): string;

}