import crypto from "node:crypto";

import {
  PkceVerifier,
} from "../../src/platform/PkceVerifier";

/**
 * PKCE verifier using the
 * Node.js crypto module.
 *
 * RFC7636
 */
export class CryptoPkceVerifier
  implements PkceVerifier {

  /**
   * Verifies a PKCE
   * code verifier.
   */
  async verify(params: {

    codeVerifier: string;

    codeChallenge: string;

    method: "plain" | "S256";

  }): Promise<boolean> {

    switch (params.method) {

      case "plain":

        return crypto.timingSafeEqual(

          Buffer.from(params.codeVerifier),

          Buffer.from(params.codeChallenge),

        );

      case "S256": {

        const digest =
          crypto
            .createHash("sha256")
            .update(
              params.codeVerifier,
            )
            .digest();

        const challenge =
          digest
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        return crypto.timingSafeEqual(

          Buffer.from(challenge),

          Buffer.from(params.codeChallenge),

        );

      }

      default:

        return false;

    }

  }

}