import crypto from "node:crypto";

import {
  OAuthTokenGenerator,
} from "../../src/platform/OAuthTokenGenerator";

/**
 * Cryptographically secure OAuth
 * token generator.
 */
export class CryptoOAuthTokenGenerator
implements OAuthTokenGenerator {

  /**
   * Generates an Access Token.
   */
  accessToken(): string {

    return "atk_" +
      crypto.randomBytes(48)
      .toString("base64url");

  }

  /**
   * Generates a Refresh Token.
   */
  refreshToken(): string {

    return "rtk_" +
      crypto.randomBytes(64)
      .toString("base64url");

  }

}