import {
  RegisterAccountWorkflow,
  VerifyAccountWorkflow,
  AuthenticateWorkflow,

  RegisterClientWorkflow,
  RegisterClientRedirectUriWorkflow,

  AuthorizeWorkflow,
  ExchangeAuthorizationCodeWorkflow,
  RefreshAccessTokenWorkflow,
  RevokeTokenWorkflow,
  IntrospectTokenWorkflow,

  CreateBrowserSessionWorkflow,
  ValidateBrowserSessionWorkflow,
  TouchBrowserSessionWorkflow,
  RefreshBrowserSessionWorkflow,
  RotateBrowserSessionWorkflow,
  RevokeBrowserSessionWorkflow,
  RevokeAllBrowserSessionsWorkflow,
  TerminateBrowserSessionWorkflow,
  ListBrowserSessionsWorkflow,

} from "../workflows";

import { ServiceFactory } from "./ServiceFactory";
import { PlatformFactory } from "./PlatformFactory";

type ServiceRegistry =
  ReturnType<typeof ServiceFactory.create>;

type PlatformRegistry =
  ReturnType<typeof PlatformFactory.create>;

/**
 * Creates every workflow
 * used by Evantra Identity.
 *
 * Workflows coordinate the
 * application's use cases.
 */
export class WorkflowFactory {

  /**
   * Builds every workflow.
   */
  static create(

    services: ServiceRegistry,

    platform: PlatformRegistry,

  ) {

    // ==========================================================
    // Identity
    // ==========================================================

    const registerAccount =
      new RegisterAccountWorkflow(

        services.accounts,

        services.credentials,

        services.verifications,

        platform.ids,

        platform.tokens,

        platform.clock,

      );

    const verifyAccount =
      new VerifyAccountWorkflow(

        services.accounts,

        services.verifications,

      );

    const authenticate =
  new AuthenticateWorkflow(

    services.authentication,

    services.sessions,

    services.browserSessions,

  );

    // ==========================================================
    // OAuth Clients
    // ==========================================================

    const registerClient =
      new RegisterClientWorkflow(

        services.clients,

        platform.ids,

        platform.clientCredentials,

        platform.passwordHasher,

      );

    const registerClientRedirectUri =
      new RegisterClientRedirectUriWorkflow(

        services.clients,

        services.redirectUris,

        platform.ids,

      );

    // ==========================================================
    // OAuth Authorization
    // ==========================================================

    const authorize =
      new AuthorizeWorkflow(

        services.clients,

        services.redirectUris,

        services.authorizationCodes,

        platform.security,

      );

    const exchangeAuthorizationCode =
      new ExchangeAuthorizationCodeWorkflow(

        services.clients,

        services.authorizationCodes,

        services.tokens,

        platform.pkce,

      );

    const refreshAccessToken =
      new RefreshAccessTokenWorkflow(

        services.clients,

        services.tokens,

      );

    const revokeToken =
      new RevokeTokenWorkflow(

        services.clients,

        services.tokens,

      );

    const introspectToken =
      new IntrospectTokenWorkflow(

        services.clients,

        services.tokens,

      );

    // ==========================================================
// Browser Sessions
// ==========================================================

const createBrowserSession =
  new CreateBrowserSessionWorkflow(
    services.browserSessions,
  );

const validateBrowserSession =
  new ValidateBrowserSessionWorkflow(
    services.browserSessions,

  );

const touchBrowserSession =
  new TouchBrowserSessionWorkflow(
    services.browserSessions,
  );

const refreshBrowserSession =
  new RefreshBrowserSessionWorkflow(
    services.browserSessions,

    platform.clock,
  );

const rotateBrowserSession =
  new RotateBrowserSessionWorkflow(
    services.browserSessions,

  );

const revokeBrowserSession =
  new RevokeBrowserSessionWorkflow(
    services.browserSessions,

  );

const revokeAllBrowserSessions =
  new RevokeAllBrowserSessionsWorkflow(
    services.browserSessions,

  );

const terminateBrowserSession =
  new TerminateBrowserSessionWorkflow(
    services.browserSessions,

  );

const listBrowserSessions =
  new ListBrowserSessionsWorkflow(
    services.browserSessions,

  );  

    // ==========================================================
    // Registry
    // ==========================================================

    return {

  identity: {

    registerAccount,

    verifyAccount,

    authenticate,

  },

  clients: {

    registerClient,

    registerClientRedirectUri,

  },

  oauth: {

    authorize,

    exchangeAuthorizationCode,

    refreshAccessToken,

    revokeToken,

    introspectToken,

  },

  session: {

    createBrowserSession,

    validateBrowserSession,

    touchBrowserSession,

    refreshBrowserSession,

    rotateBrowserSession,

    revokeBrowserSession,

    revokeAllBrowserSessions,

    terminateBrowserSession,

    listBrowserSessions,

  },

};
  }

}
