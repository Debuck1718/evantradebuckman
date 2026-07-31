import {
  RegisterAccountWorkflow,
  VerifyAccountWorkflow,
  AuthenticateWorkflow,

  RegisterClientWorkflow,
  RegisterClientRedirectUriWorkflow,

  ExchangeAuthorizationCodeWorkflow,
  RefreshAccessTokenWorkflow,
  RevokeTokenWorkflow,
  IntrospectTokenWorkflow,

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

    const exchangeAuthorizationCode =
      new ExchangeAuthorizationCodeWorkflow(

        services.clients,

        services.authorizationCodes,

        services.tokens,

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

    return {

      // ========================================================
      // Identity
      // ========================================================

      registerAccount,

      verifyAccount,

      authenticate,

      // ========================================================
      // OAuth Clients
      // ========================================================

      registerClient,

      registerClientRedirectUri,

      // ========================================================
      // OAuth Authorization
      // ========================================================

      exchangeAuthorizationCode,
      refreshAccessToken,
      revokeToken,
      introspectToken,

    };

  }

}