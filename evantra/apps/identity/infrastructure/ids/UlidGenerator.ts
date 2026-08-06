import { ulid } from "ulid";

import {
  IdGenerator,
} from "../../src/platform/IdGenerator";

/**
 * Generates ULID identifiers
 * for the Identity platform.
 */
export class UlidGenerator
  implements IdGenerator {

  /**
   * Generates an Account ID.
   */
  account(): string {
    return ulid();
  }

  /**
   * Generates a Verification ID.
   */
  verification(): string {
    return ulid();
  }

  /**
   * Generates a Session ID.
   */
  session(): string {
    return ulid();
  }

  /**
   * Generates a Recovery ID.
   */
  recovery(): string {
    return ulid();
  }

  /**
   * Generates a Client ID.
   */
  client(): string {
    return ulid();
  }

  /**
   * Generates a Client Redirect URI ID.
   */
  redirectUri(): string {
    return ulid();
  }

  /**
   * Generates a Client Scope ID.
   */
  clientScope(): string {
    return ulid();
  }

  /**
   * Generates a User Consent ID.
   */
  userConsent(): string {
    return ulid();
  }

  /**
   * Generates an Authorization Code ID.
   */
  authorizationCode(): string {
    return ulid();
  }

  /**
   * Generates an Access Token ID.
   */
  accessToken(): string {
    return ulid();
  }

  /**
   * Generates a Refresh Token ID.
   */
  refreshToken(): string {
    return ulid();
  }

  /**
   * Generates an Email Change ID.
   */
  emailChange(): string {
    return ulid();
  }

  /**
 * Generates an Audit Event ID.
 */
auditEvent(): string {
  return ulid();
}

}