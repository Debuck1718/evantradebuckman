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

    return router;

  }

}