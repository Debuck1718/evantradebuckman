import {
  SystemClock,
} from "../../infrastructure/clock/SystemClock";

import {
  UlidGenerator,
} from "../../infrastructure/ids/UlidGenerator";

import {
  CryptoTokenGenerator,
} from "../../infrastructure/tokens/CryptoTokenGenerator";

import {
  CryptoAuthorizationCodeGenerator,
} from "../../infrastructure/authorization/CryptoAuthorizationCodeGenerator";

import {
  CryptoClientCredentialGenerator,
} from "../../infrastructure/client/CryptoClientCredentialGenerator";

import {
  Argon2PasswordHasher,
} from "../../infrastructure/password/Argon2PasswordHasher";

import {
  CryptoOAuthTokenGenerator,
} from "../../infrastructure/oauth/CryptoOAuthTokenGenerator";
/**
 * Creates every platform service
 * used by Evantra Identity.
 *
 * Platform services provide
 * infrastructure capabilities
 * such as identifiers, clocks,
 * cryptography and credential
 * generation.
 */
export class PlatformFactory {

  /**
   * Builds every platform service.
   */
  static create() {

    const clock =
      new SystemClock();

    const ids =
      new UlidGenerator();

    const tokens =
      new CryptoTokenGenerator();

    const authorizationCodes =
      new CryptoAuthorizationCodeGenerator();

    const clientCredentials =
      new CryptoClientCredentialGenerator();

    const passwordHasher =
      new Argon2PasswordHasher();

     const oauthTokens =
    new CryptoOAuthTokenGenerator(); 

    return {

      clock,

      ids,

      tokens,

      authorizationCodes,

      clientCredentials,

      passwordHasher,

      oauthTokens,

    };

  }

}