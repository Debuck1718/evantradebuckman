import crypto from "crypto";

import {
  AuthorizationCodeGenerator,
} from "../../src/platform/AuthorizationCodeGenerator";

/**
 * Cryptographically secure
 * OAuth Authorization Code
 * generator.
 */
export class CryptoAuthorizationCodeGenerator
  implements AuthorizationCodeGenerator {

  /**
   * Generates a new
   * Authorization Code.
   */
  async generate(): Promise<string> {

    const bytes =
      crypto.randomBytes(32);

    return `ac_${bytes.toString("base64url")}`;

  }

}