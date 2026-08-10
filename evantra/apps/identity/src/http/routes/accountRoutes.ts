import { Router } from "express";

import { HttpFactory } from "../../factory/HttpFactory";

type IdentityRegistry =
  ReturnType<typeof HttpFactory.create>["identity"];

export function createAccountRoutes(
  identity: IdentityRegistry,
): Router {

  const router = Router();
  const authentication = identity.controllers.authentication;

  router.post(
    "/authenticate",
    authentication.authenticate.handle.bind(
      authentication.authenticate,
    ),
  );

  router.post(
    "/register",
    authentication.register.handle.bind(
      authentication.register,
    ),
  );

  router.post(
    "/verify",
    authentication.verify.handle.bind(
      authentication.verify,
    ),
  );

  router.post(
    "/logout",
    authentication.logout.handle.bind(
      authentication.logout,
    ),
  );

  router.post(
    "/session",
    authentication.validateSession.handle.bind(
      authentication.validateSession,
    ),
  );

  router.post(
    "/session/refresh",
    authentication.refreshSession.handle.bind(
      authentication.refreshSession,
    ),
  );

  router.post(
    "/session/touch",
    authentication.touchSession.handle.bind(
      authentication.touchSession,
    ),
  );

  router.post(
    "/sessions",
    authentication.listSessions.handle.bind(
      authentication.listSessions,
    ),
  );

  router.delete(
    "/sessions",
    authentication.revokeSession.handle.bind(
      authentication.revokeSession,
    ),
  );

  router.delete(
    "/sessions/all",
    authentication.revokeAllSessions.handle.bind(
      authentication.revokeAllSessions,
    ),
  );

  router.post(
    "/session/rotate",
    authentication.rotateSession.handle.bind(
      authentication.rotateSession,
    ),
  );

  router.post(
    "/session/terminate",
    authentication.terminateSession.handle.bind(
      authentication.terminateSession,
    ),
  );

  router.post(
    "/forgot-password",
    authentication.forgotPassword.handle.bind(
      authentication.forgotPassword,
    ),
  );

  router.post(
    "/reset-password",
    authentication.resetPassword.handle.bind(
      authentication.resetPassword,
    ),
  );

  router.post(
    "/change-password",
    authentication.changePassword.handle.bind(
      authentication.changePassword,
    ),
  );

  router.post(
    "/resend-verification",
    authentication.resendVerification.handle.bind(
      authentication.resendVerification,
    ),
  );

  router.post(
    "/contact-email/request",
    authentication.requestContactEmailChange.handle.bind(
      authentication.requestContactEmailChange,
    ),
  );

  router.post(
    "/contact-email/verify",
    authentication.verifyContactEmailChange.handle.bind(
      authentication.verifyContactEmailChange,
    ),
  );

  return router;

}