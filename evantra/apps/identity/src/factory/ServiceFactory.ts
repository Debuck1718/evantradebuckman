import {
  AccountService,
} from "../account";

import {
  AuthenticationService,
  CredentialService,
} from "../authentication";

import {
  VerificationService,
} from "../verification";

import {
  RecoveryService,
} from "../recovery";

import {
  SessionService,
} from "../session";

import {
  ClientService,
  ClientRedirectUriService,
} from "../client";

import {
  AuthorizationCodeService,
} from "../authorization";

import {
  TokenService,
} from "../authorization";

import { RepositoryFactory } from "./RepositoryFactory";
import { PlatformFactory } from "./PlatformFactory";

type RepositoryRegistry =
  ReturnType<typeof RepositoryFactory.create>;

type PlatformRegistry =
  ReturnType<typeof PlatformFactory.create>;

/**
 * Creates every domain service
 * used by Evantra Identity.
 */
export class ServiceFactory {

  /**
   * Builds every domain service.
   */
  static create(
    repositories: RepositoryRegistry,
    platform: PlatformRegistry,
  ) {

    // ==========================================================
    // Identity
    // ==========================================================

    const accounts =
      new AccountService(
        repositories.accounts
      );

    const credentials =
      new CredentialService(
        repositories.credentials,
        platform.passwordHasher
      );

    const authentication =
      new AuthenticationService(
        repositories.accounts,
        credentials
      );

    const verifications =
      new VerificationService(
        repositories.verifications
      );

    const recoveries =
      new RecoveryService(
        repositories.recoveries,
        platform.ids,
        platform.tokens,
        platform.clock
      );

    const sessions =
      new SessionService(
        repositories.sessions,
        platform.ids,
        platform.clock
      );

    // ==========================================================
    // OAuth Clients
    // ==========================================================

    const clients =
      new ClientService(
        repositories.clients,
        platform.passwordHasher
      );

    const redirectUris =
      new ClientRedirectUriService(
        repositories.redirectUris
      );

    // ==========================================================
    // OAuth Authorization
    // ==========================================================

    const authorizationCodes =
  new AuthorizationCodeService(

    repositories.authorizationCodes,

    platform.ids,

    platform.authorizationCodes,

    platform.clock,

    platform.security,

  );


    const tokens =
  new TokenService(

    repositories.accessTokens,

    repositories.refreshTokens,

    platform.ids,

    platform.oauthTokens,

    platform.clock,

  );  

    return {

  accounts,

  authentication,

  credentials,

  verifications,

  recoveries,

  sessions,

  clients,

  redirectUris,

  authorizationCodes,

  tokens,

};

  }

}