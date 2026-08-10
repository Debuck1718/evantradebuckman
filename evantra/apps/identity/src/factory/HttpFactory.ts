import { WorkflowFactory } from "./WorkflowFactory";
import { PlatformFactory } from "./PlatformFactory";

import { AuthorizationController } from "../http/controllers/AuthorizationController";
import { TokenController } from "../http/controllers/TokenController";
import { RevokeTokenController } from "../http/controllers/RevokeTokenController";
import { IntrospectTokenController } from "../http/controllers/IntrospectTokenController";
import { UserInfoController } from "../http/controllers/UserInfoController";
import { RegisterClientController } from "../http/controllers/RegisterClientController";
import { RegisterClientRedirectUriController } from "../http/controllers/RegisterClientRedirectUriController";
import { OidcDiscoveryController } from "../http/controllers/OidcDiscoveryController";
import { OidcJwksController } from "../http/controllers/OidcJwksController";
import { AuthenticateController } from "../authentication/controllers/AuthenticateController";
import { RegisterController } from "../authentication/controllers/RegisterController";
import { VerifyAccountController } from "../authentication/controllers/VerifyAccountController";
import { LogoutController } from "../authentication/controllers/LogoutController";
import { ValidateSessionController } from "../authentication/controllers/ValidateSessionController";
import { RefreshSessionController } from "../authentication/controllers/RefreshSessionController";
import { TouchSessionController } from "../authentication/controllers/TouchSessionController";
import { ListBrowserSessionsController } from "../authentication/controllers/ListBrowserSessionsController";
import { RevokeBrowserSessionController } from "../authentication/controllers/RevokeBrowserSessionController";
import { RevokeAllBrowserSessionsController } from "../authentication/controllers/RevokeAllBrowserSessionsController";
import { RotateBrowserSessionController } from "../authentication/controllers/RotateBrowserSessionController";
import { ForgotPasswordController } from "../authentication/controllers/ForgotPasswordController";
import { ResetPasswordController } from "../authentication/controllers/ResetPasswordController";
import { ChangePasswordController } from "../authentication/controllers/ChangePasswordController";
import { ResendVerificationController } from "../authentication/controllers/ResendVerificationController";
import { RequestContactEmailChangeController } from "../authentication/controllers/RequestContactEmailChangeController";
import { VerifyContactEmailChangeController } from "../authentication/controllers/VerifyContactEmailChangeController";
import { TerminateBrowserSessionController } from "../authentication/controllers/TerminateBrowserSessionController";
import { RotateClientSecretController } from "../client/RotateClientSecretController";
import { ApproveClientController } from "../client/ApproveClientController";

import { AuthorizationCodeGrantHandler } from "../http/oauth/grants/AuthorizationCodeGrantHandler";
import { RefreshTokenGrantHandler } from "../http/oauth/grants/RefreshTokenGrantHandler";
import { TokenGrantDispatcher } from "../http/oauth/grants/TokenGrantDispatcher";

import { OAuthConfiguration } from "../http/oauth/OAuthConfiguration";

type WorkflowRegistry =
  ReturnType<typeof WorkflowFactory.create>;

type PlatformRegistry =
  ReturnType<typeof PlatformFactory.create>;

/**
 * Builds the complete HTTP layer.
 *
 * Every HTTP dependency is created
 * here exactly once.
 */
export class HttpFactory {

  static create(

    workflows: WorkflowRegistry,

    platform: PlatformRegistry,

  ) {

    // ==========================================================
    // OAuth Configuration
    // ==========================================================

    const oauthConfiguration: OAuthConfiguration = {

      accessTokenLifetime:
        platform.security.accessTokenLifetime,

      refreshTokenLifetime:
        platform.security.refreshTokenLifetime,

    };

    // ==========================================================
    // OAuth Grant Handlers
    // ==========================================================

    const authorizationCodeGrant =
      new AuthorizationCodeGrantHandler(

        workflows.oauth.exchangeAuthorizationCode,

        oauthConfiguration,

      );

    const refreshTokenGrant =
      new RefreshTokenGrantHandler(

        workflows.oauth.refreshAccessToken,

        oauthConfiguration,

      );

    // ==========================================================
    // OAuth Dispatcher
    // ==========================================================

    const tokenDispatcher =
      new TokenGrantDispatcher([

        authorizationCodeGrant,

        refreshTokenGrant,

      ]);

    // ==========================================================
    // OAuth Controllers
    // ==========================================================

    const authorizationController =
      new AuthorizationController(

        workflows.oauth.authorize,

        workflows.session.validateBrowserSession,

      );

    const tokenController =
      new TokenController(

        tokenDispatcher,

      );

    const revokeTokenController =
      new RevokeTokenController(

        workflows.oauth.revokeToken,

      );

    const introspectTokenController =
      new IntrospectTokenController(

        workflows.oauth.introspectToken,

      );

    const userInfoController =
      new UserInfoController(

        workflows.oauth.userInfo,

      );

    // ==========================================================
    // Identity Controllers
    // ==========================================================

    const authenticateController =
      new AuthenticateController(

        workflows.identity.authenticate,

      );

    const registerController =
      new RegisterController(

        workflows.identity.registerAccount,

      );

    const verifyAccountController =
      new VerifyAccountController(

        workflows.identity.verifyAccount,

      );

    const logoutController =
      new LogoutController(

        workflows.session.terminateBrowserSession,

      );

    const validateSessionController =
      new ValidateSessionController(

        workflows.session.validateIdentitySession,

      );

    const refreshSessionController =
      new RefreshSessionController(

        workflows.session.refreshBrowserSession,

      );

    const touchSessionController =
      new TouchSessionController(

        workflows.session.touchBrowserSession,

      );

    const listSessionsController =
      new ListBrowserSessionsController(

        workflows.session.validateBrowserSession,

        workflows.session.listBrowserSessions,

      );

    const revokeSessionController =
      new RevokeBrowserSessionController(

        workflows.session.revokeBrowserSession,

      );

    const revokeAllSessionsController =
      new RevokeAllBrowserSessionsController(

        workflows.session.revokeAllBrowserSessions,

      );

    const rotateSessionController =
      new RotateBrowserSessionController(

        workflows.session.rotateBrowserSession,

      );

    const terminateSessionController =
      new TerminateBrowserSessionController(

        workflows.session.terminateBrowserSession,

      );

    const forgotPasswordController =
      new ForgotPasswordController(

        workflows.identity.forgotPassword,

      );

    const resetPasswordController =
      new ResetPasswordController(

        workflows.identity.resetPassword,

      );

    const changePasswordController =
      new ChangePasswordController(

        workflows.identity.changePassword,

      );

    const resendVerificationController =
      new ResendVerificationController(

        workflows.identity.resendVerification,

      );

    const requestContactEmailChangeController =
      new RequestContactEmailChangeController(

        workflows.identity.requestContactEmailChange,

      );

    const verifyContactEmailChangeController =
      new VerifyContactEmailChangeController(

        workflows.identity.verifyContactEmailChange,

      );

    // ==========================================================
    // Client Controllers
    // ==========================================================

    const registerClientController =
      new RegisterClientController(

        workflows.clients.registerClient,

      );

    const registerClientRedirectUriController =
      new RegisterClientRedirectUriController(

        workflows.clients.registerClientRedirectUri,

      );

    const rotateClientSecretController =
      new RotateClientSecretController(

        workflows.clients.rotateClientSecret,

      );

    const approveClientController =
      new ApproveClientController(

        workflows.clients.approveClient,

      );

    // ==========================================================
    // OIDC Controllers
    // ==========================================================

    const oidcDiscoveryController =
      new OidcDiscoveryController();

    const oidcJwksController =
      new OidcJwksController();

    // ==========================================================
    // HTTP Registry
    // ==========================================================

    return {

      oauth: {

        configuration:
          oauthConfiguration,

        controllers: {

          authorization:
            authorizationController,

          token:
            tokenController,

          revokeToken:
            revokeTokenController,

          introspectToken:
            introspectTokenController,

          userInfo:
            userInfoController,

        },

        grants: {

          authorizationCode:
            authorizationCodeGrant,

          refreshToken:
            refreshTokenGrant,

          dispatcher:
            tokenDispatcher,

        },

      },

      identity: {

        controllers: {

          authentication: {

            authenticate:
              authenticateController,

            register:
              registerController,

            verify:
              verifyAccountController,

            logout:
              logoutController,

            validateSession:
              validateSessionController,

            refreshSession:
              refreshSessionController,

            touchSession:
              touchSessionController,

            listSessions:
              listSessionsController,

            revokeSession:
              revokeSessionController,

            revokeAllSessions:
              revokeAllSessionsController,

            rotateSession:
              rotateSessionController,

            terminateSession:
              terminateSessionController,

            forgotPassword:
              forgotPasswordController,

            resetPassword:
              resetPasswordController,

            changePassword:
              changePasswordController,

            resendVerification:
              resendVerificationController,

            requestContactEmailChange:
              requestContactEmailChangeController,

            verifyContactEmailChange:
              verifyContactEmailChangeController,

          },

        },

      },

      clients: {

        controllers: {

          registerClient:
            registerClientController,

          registerRedirectUri:
            registerClientRedirectUriController,

          approveClient:
            approveClientController,

          rotateClientSecret:
            rotateClientSecretController,

        },

      },

      oidc: {

        controllers: {

          discovery:
            oidcDiscoveryController,

          jwks:
            oidcJwksController,

        },

      },

    };

  }

}