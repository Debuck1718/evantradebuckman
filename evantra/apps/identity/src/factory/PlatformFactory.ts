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

import {
  CryptoPkceVerifier,
} from "../../infrastructure/oauth/CryptoPkceVerifier";

import { SecurityConfiguration } from "../platform/SecurityConfiguration";
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

  const pkce =
  new CryptoPkceVerifier();  

  // ==========================================================
  // Security Policy
  // ==========================================================

  const security: SecurityConfiguration = {

    authorizationCodeLifetime:
      5 * 60 * 1000,

    accessTokenLifetime:
      60 * 60 * 1000,

    refreshTokenLifetime:
      30 * 24 * 60 * 60 * 1000,

    sessionLifetime:
      30 * 24 * 60 * 60 * 1000,

    verificationLifetime:
      24 * 60 * 60 * 1000,

    recoveryLifetime:
      60 * 60 * 1000,

    maxFailedLoginAttempts:
      5,

    accountLockDuration:
      15 * 60 * 1000,

    requirePkce:
      true,

    requireHttpsRedirectUris:
      true,

  };

  return {

    clock,

    ids,

    tokens,

    authorizationCodes,

    clientCredentials,

    passwordHasher,

    oauthTokens,

    pkce,

    security,

  };

}
}