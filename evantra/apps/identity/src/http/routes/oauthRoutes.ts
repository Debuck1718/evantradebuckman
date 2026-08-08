import { Router } from "express";

import { HttpFactory } from "../../factory/HttpFactory";

type OAuthRegistry =
  ReturnType<
    typeof HttpFactory.create
  >["oauth"];

/**
 * OAuth Routes
 */
export function createOAuthRoutes(
  oauth: OAuthRegistry,
): Router {

  const router =
    Router();

  // ==========================================================
  // Authorization Endpoint
  // ==========================================================

  router.get(
    "/authorize",
    oauth.controllers.authorization
      .handle
      .bind(
        oauth.controllers.authorization,
      ),
  );

  // ==========================================================
  // Token Endpoint
  // ==========================================================

  router.post(
    "/token",
    oauth.controllers.token
      .handle
      .bind(
        oauth.controllers.token,
      ),
  );

  return router;
}