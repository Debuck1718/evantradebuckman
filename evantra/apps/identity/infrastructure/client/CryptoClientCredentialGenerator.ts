import crypto from "node:crypto";

import {
  ClientCredentialGenerator,
} from "../../src/platform/ClientCredentialGenerator";

/**
 * Generates OAuth Client
 * credentials.
 */
export class CryptoClientCredentialGenerator
  implements ClientCredentialGenerator {

  /**
   * Generates a public
   * Client ID.
   */
  clientId(): string {

    return this.generate(
      "cli"
    );

  }

  /**
   * Generates a plain-text
   * Client Secret.
   */
  clientSecret(): string {

    return this.generate(
      "cls"
    );

  }

  /**
   * Generates a prefixed
   * credential.
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