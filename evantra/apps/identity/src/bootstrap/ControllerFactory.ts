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
  WorkflowFactory,
} from "../factory/WorkflowFactory";
import { ListBrowserSessionsController } from "../authentication/controllers/ListBrowserSessionsController";

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

    workflows.session.validateBrowserSession,

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

    workflows.session
      .listBrowserSessions,

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

  },

};
  }

}