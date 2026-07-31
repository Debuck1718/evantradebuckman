import crypto from "node:crypto";

import {
  TokenGenerator,
} from "../../src/platform/TokenGenerator";

/**
 * Generates cryptographically
 * secure tokens for the
 * Evantra Identity Platform.
 */
export class CryptoTokenGenerator
  implements TokenGenerator {

  /**
   * Generates an email
   * verification token.
   */
  verification(): string {
    return this.generate("evt");
  }

  /**
   * Generates a password
   * recovery token.
   */
  recovery(): string {
    return this.generate("rcv");
  }

  /**
   * Generates an OAuth
   * Authorization Code.
   */
  authorizationCode(): string {
    return this.generate("ac");
  }

  /**
   * Generates an OAuth
   * Access Token.
   */
  accessToken(): string {
    return this.generate("atk");
  }

  /**
   * Generates an OAuth
   * Refresh Token.
   */
  refreshToken(): string {
    return this.generate("rtk");
  }

  /**
   * Generates a secure token
   * with a semantic prefix.
   */
  private generate(
    prefix: string
  ): string {

    const random =
      crypto
        .randomBytes(32)
        .toString("base64url");

    return `${prefix}_${random}`;
  }

}