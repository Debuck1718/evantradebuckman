import { Pool } from "pg";

import {
  PostgresAccountRepository,
} from "../../infrastructure/database/PostgresAccountRepository";

import {
  PostgresCredentialRepository,
} from "../../infrastructure/database/PostgresCredentialRepository";

import {
  PostgresVerificationRepository,
} from "../../infrastructure/database/PostgresVerificationRepository";

import {
  PostgresRecoveryRepository,
} from "../../infrastructure/database/PostgresRecoveryRepository";

import {
  PostgresSessionRepository,
} from "../../infrastructure/database/PostgresSessionRepository";

import {
  PostgresClientRepository,
} from "../../infrastructure/database/PostgresClientRepository";

import {
  PostgresClientRedirectUriRepository,
} from "../../infrastructure/database/PostgresClientRedirectUriRepository";

import {
  PostgresAuthorizationCodeRepository,
} from "../../infrastructure/database/PostgresAuthorizationCodeRepository";

import {
  PostgresAccessTokenRepository,
} from "../../infrastructure/database/PostgresAccessTokenRepository";

import {
  PostgresRefreshTokenRepository,
} from "../../infrastructure/database/PostgresRefreshTokenRepository";

/**
 * Creates every repository used
 * by Evantra Identity.
 */
export class RepositoryFactory {

  /**
   * Builds every repository.
   */
  static create(
    db: Pool
  ) {

    const accounts =
      new PostgresAccountRepository(db);

    const credentials =
      new PostgresCredentialRepository(db);

    const verifications =
      new PostgresVerificationRepository(db);

    const recoveries =
      new PostgresRecoveryRepository(db);

    const sessions =
      new PostgresSessionRepository(db);

    const clients =
      new PostgresClientRepository(db);

    const redirectUris =
      new PostgresClientRedirectUriRepository(db);

    const authorizationCodes =
      new PostgresAuthorizationCodeRepository(db);

    const accessTokens =
      new PostgresAccessTokenRepository(db);

    const refreshTokens =
      new PostgresRefreshTokenRepository(db);

    return {

      accounts,

      credentials,

      verifications,

      recoveries,

      sessions,

      clients,

      redirectUris,

      authorizationCodes,

      accessTokens,

      refreshTokens,

    };

  }

}