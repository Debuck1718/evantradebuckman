import {
  AuthenticateController,
} from "../authentication/controllers/AuthenticateController";
import {
  RegisterController,
} from "../authentication/controllers/RegisterController";

import {
  VerifyAccountController,
} from "../authentication/controllers/VerifyAccountController";

import {
  LogoutController,
} from "../authentication/controllers/LogoutController";

import {
  ValidateSessionController,
} from "../authentication/controllers/ValidateSessionController";

import {
  RefreshSessionController,
} from "../authentication/controllers/RefreshSessionController";

import {
  TouchSessionController,
} from "../authentication/controllers/TouchSessionController";

import {
  RevokeBrowserSessionController,
} from "../authentication/controllers/RevokeBrowserSessionController";

import {
  WorkflowFactory,
} from "../factory/WorkflowFactory";

import { ListBrowserSessionsController } from "../authentication/controllers/ListBrowserSessionsController";

import {
  RevokeAllBrowserSessionsController,
} from "../authentication/controllers/RevokeAllBrowserSessionsController";

import {
  RotateBrowserSessionController,
} from "../authentication/controllers/RotateBrowserSessionController";

import {
  ForgotPasswordController,
} from "../authentication/controllers/ForgotPasswordController";

import {
  ResetPasswordController,
} from "../authentication/controllers/ResetPasswordController";

import {
  ChangePasswordController,
} from "../authentication/controllers/ChangePasswordController";

import { ResendVerificationController } from "../authentication/controllers/ResendVerificationController";

import {
  RotateClientSecretController,
} from "../client";

import {
  IntrospectTokenController,
} from "../http/controllers/IntrospectTokenController";

import {
  UserInfoController,
} from "../http/controllers/UserInfoController";

import {
  RevokeTokenController,
} from "../http/controllers/RevokeTokenController";

import {
  RequestContactEmailChangeController,
} from "../authentication/controllers/RequestContactEmailChangeController";
import {
  VerifyContactEmailChangeController,
} from "../authentication/controllers/VerifyContactEmailChangeController";
import { TerminateBrowserSessionController } from "../authentication/controllers/TerminateBrowserSessionController";

export {
  TerminateBrowserSessionController,
} from "../authentication/controllers/TerminateBrowserSessionController";

type WorkflowRegistry =
  ReturnType<
    typeof WorkflowFactory.create
  >;

/**
 * Creates every HTTP controller
 * used by Evantra Identity.
 *
 * Controllers coordinate the
 * application's use cases.
 */
export class ControllerFactory {

  /**
   * Builds every controller.
   */
  static create(
    workflows: WorkflowRegistry,
  ) {

    // ======================================================
    // Authentication
    // ======================================================

    const authenticate =
      new AuthenticateController(

        workflows.identity.authenticate,

      );

    const register =
  new RegisterController(

    workflows.identity.registerAccount,

  );

    const verify =
  new VerifyAccountController(

    workflows.identity.verifyAccount,

  );

    const logout =
  new LogoutController(

    workflows.session.terminateBrowserSession,

  );

const validateSession =
  new ValidateSessionController(

    workflows.session.validateIdentitySession,

  );

const refreshSession =
  new RefreshSessionController(

    workflows.session.refreshBrowserSession,

  );

const touchSession =
  new TouchSessionController(

    workflows.session
      .touchBrowserSession,

  );

  const listSessions =
  new ListBrowserSessionsController(

    workflows.session.validateBrowserSession,

    workflows.session.listBrowserSessions,

  );

  const revokeSession =
  new RevokeBrowserSessionController(

    workflows.session
      .revokeBrowserSession,

  );

  const revokeAllSessions =
  new RevokeAllBrowserSessionsController(

    workflows.session
      .revokeAllBrowserSessions,

  );

  const rotateSession =
  new RotateBrowserSessionController(

    workflows.session
      .rotateBrowserSession,

  );

  const forgotPassword =
  new ForgotPasswordController(

    workflows.identity
      .forgotPassword,

  );

  const resetPassword =
  new ResetPasswordController(

    workflows.identity.resetPassword,

  );

  const changePassword =
  new ChangePasswordController(

    workflows.identity.changePassword,

  );

  const resendVerification =
  new ResendVerificationController(

    workflows.identity
      .resendVerification,

  );

  // ==========================================================
// Contact Email
// ==========================================================

const requestContactEmailChange =
  new RequestContactEmailChangeController(

    workflows.identity
      .requestContactEmailChange,

  );

const verifyContactEmailChange =
  new VerifyContactEmailChangeController(

    workflows.identity
      .verifyContactEmailChange,

  );

  const terminateSession =
  new TerminateBrowserSessionController(
    workflows.session.terminateBrowserSession,
  );

  // ======================================================
// OAuth Clients
// ======================================================

const rotateClientSecret =
  new RotateClientSecretController(

    workflows.clients
      .rotateClientSecret,

  );

  // ======================================================
// OAuth
// ======================================================

const introspectToken =
  new IntrospectTokenController(
    workflows.oauth.introspectToken,
  );

const revokeToken =
  new RevokeTokenController(
    workflows.oauth.revokeToken,
  );

const userInfo =
  new UserInfoController(
    workflows.oauth.userInfo,
  );  

    // ======================================================
    // Registry
    // ======================================================

    return {

  authentication: {

    register,

    verify,

    authenticate,

    logout,

    validateSession,

    refreshSession,

    touchSession,

    listSessions,

    revokeSession,

    revokeAllSessions,

    rotateSession,

    terminateSession,

    forgotPassword,

    resetPassword,

    changePassword,

    resendVerification,

    requestContactEmailChange,

    verifyContactEmailChange,

  },

  clients: {

    rotateClientSecret,

  },

  oauth: {
  introspectToken,
  revokeToken,
  userInfo,
},

};
  }

}