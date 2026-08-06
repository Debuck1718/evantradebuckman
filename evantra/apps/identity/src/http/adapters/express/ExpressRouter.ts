import {
  Router,
} from "express";

import {
  Application,
} from "../../../bootstrap/Application";

import {
  ExpressHttpAdapter,
} from "./ExpressHttpAdapter";

/**
 * Creates every HTTP route
 * exposed by Evantra Identity.
 */
export class ExpressRouter {

  static create(
    application: ReturnType<typeof Application.create>,
  ): Router {

    const router =
      Router();

    // ======================================================
    // Identity
    // ======================================================

    router.post(

      "/identity/authenticate",

      ExpressHttpAdapter.adapt(

        application
          .identity
          .controllers
          .authentication
          .authenticate,

      ),

    );

    router.post(

  "/identity/register",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .register,

  ),

);

router.post(

  "/identity/verify",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .verify,

  ),

);

router.post(

  "/identity/logout",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .logout,

  ),

);

router.post(

  "/identity/session",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .validateSession,

  ),

);

router.post(

  "/identity/session/refresh",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .refreshSession,

  ),

);

router.post(

  "/identity/session/touch",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .touchSession,

  ),

);

router.post(

  "/identity/sessions",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .listSessions,

  ),

);

router.delete(

  "/identity/sessions",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .revokeSession,

  ),

);

router.delete(

  "/identity/sessions/all",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .revokeAllSessions,

  ),

);

router.post(

  "/identity/session/rotate",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .rotateSession,

  ),

);

router.post(

  "/identity/forgot-password",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .forgotPassword,

  ),

);

router.post(

  "/identity/reset-password",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .resetPassword,

  ),

);

router.post(

  "/identity/change-password",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .changePassword,

  ),

);

router.post(

  "/identity/resend-verification",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .resendVerification,

  ),

);

// ======================================================
// Contact Email
// ======================================================

router.post(

  "/identity/contact-email/request",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .requestContactEmailChange,

  ),

);

router.post(

  "/identity/contact-email/verify",

  ExpressHttpAdapter.adapt(

    application
      .identity
      .controllers
      .authentication
      .verifyContactEmailChange,

  ),

);
    return router;

  }

}