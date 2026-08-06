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
  BrowserSessionService,
} from "../session";

import {
  ClientService,
  ClientRedirectUriService,
} from "../client";

import {
  AuthorizationCodeService,
  TokenService,
} from "../authorization";

import {
  CommunicationService,
  ConsoleCommunicationProvider,
} from "../communication";

import {
  EmailChangeService,
} from "../emailChange";

import {
  AuditService,
} from "../audit";

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

        repositories.accounts,

      );

    const credentials =
      new CredentialService(

        repositories.credentials,

        platform.passwordHasher,

      );

    const authentication =
      new AuthenticationService(

        repositories.accounts,

        credentials,

      );

    const verifications =
      new VerificationService(

        repositories.verifications,

      );

    const recoveries =
      new RecoveryService(

        repositories.recoveries,

        platform.ids,

        platform.tokens,

        platform.clock,

      );

    const sessions =
      new SessionService(

        repositories.sessions,

        platform.ids,

        platform.clock,

      );

    const browserSessions =
      new BrowserSessionService(

        repositories.browserSessions,

      );

    // ==========================================================
    // OAuth Clients
    // ==========================================================

    const clients =
      new ClientService(

        repositories.clients,

        platform.passwordHasher,

      );

    const redirectUris =
      new ClientRedirectUriService(

        repositories.redirectUris,

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

      const communication =
  new CommunicationService(

    new ConsoleCommunicationProvider(),

  );

  const emailChanges =
  new EmailChangeService(

    repositories.emailChanges,

    platform.ids,

    platform.tokens,

    platform.clock,

  );

  const audit =
  new AuditService(

    repositories.audits,

    platform.ids,

    platform.clock,

  );

    // ==========================================================
    // Registry
    // ==========================================================

    return {

      // Identity

      accounts,

      credentials,

      authentication,

      verifications,

      recoveries,

      sessions,

      communication,

      browserSessions,
      
      emailChanges,

      audit,

      // OAuth Clients

      clients,

      redirectUris,

      // OAuth

      authorizationCodes,

      tokens,

    };

  }

}