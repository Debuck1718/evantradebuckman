import { Router } from "express";

import { HttpFactory } from "../../factory/HttpFactory";
import { ExpressHttpAdapter } from "../adapters/express/ExpressHttpAdapter";

type IdentityRegistry =
  ReturnType<typeof HttpFactory.create>["identity"];

/**
 * Identity and browser session routes.
 */
export function createIdentityRoutes(
  identity: IdentityRegistry,
): Router {

  const router = Router();

  const controllers = identity.controllers;

  const authentication =
    controllers.authentication;

  router.post(
    "/authenticate",
    ExpressHttpAdapter.adapt(
      authentication.authenticate,
    ),
  );

  router.post(
    "/register",
    ExpressHttpAdapter.adapt(
      authentication.register,
    ),
  );

  router.post(
    "/verify",
    ExpressHttpAdapter.adapt(
      authentication.verify,
    ),
  );

  router.post(
    "/logout",
    ExpressHttpAdapter.adapt(
      authentication.logout,
    ),
  );

  router.post(
    "/session",
    ExpressHttpAdapter.adapt(
      authentication.validateSession,
    ),
  );

  router.post(
    "/session/refresh",
    ExpressHttpAdapter.adapt(
      authentication.refreshSession,
    ),
  );

  router.post(
    "/session/touch",
    ExpressHttpAdapter.adapt(
      authentication.touchSession,
    ),
  );

  router.post(
    "/sessions",
    ExpressHttpAdapter.adapt(
      authentication.listSessions,
    ),
  );

  router.delete(
    "/sessions",
    ExpressHttpAdapter.adapt(
      authentication.revokeSession,
    ),
  );

  router.delete(
    "/sessions/all",
    ExpressHttpAdapter.adapt(
      authentication.revokeAllSessions,
    ),
  );

  router.post(
    "/session/rotate",
    ExpressHttpAdapter.adapt(
      authentication.rotateSession,
    ),
  );

  router.post(
    "/session/terminate",
    ExpressHttpAdapter.adapt(
      authentication.terminateSession,
    ),
  );

  router.post(
    "/forgot-password",
    ExpressHttpAdapter.adapt(
      authentication.forgotPassword,
    ),
  );

  router.post(
    "/reset-password",
    ExpressHttpAdapter.adapt(
      authentication.resetPassword,
    ),
  );

  router.post(
    "/change-password",
    ExpressHttpAdapter.adapt(
      authentication.changePassword,
    ),
  );

  router.post(
    "/resend-verification",
    ExpressHttpAdapter.adapt(
      authentication.resendVerification,
    ),
  );

  router.post(
    "/contact-email/request",
    ExpressHttpAdapter.adapt(
      authentication.requestContactEmailChange,
    ),
  );

  router.post(
    "/contact-email/verify",
    ExpressHttpAdapter.adapt(
      authentication.verifyContactEmailChange,
    ),
  );

  return router;

}
