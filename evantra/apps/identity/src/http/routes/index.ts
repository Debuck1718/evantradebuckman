import { Router } from "express";

import { HttpFactory } from "../../factory/HttpFactory";

import { createOAuthRoutes } from "./oauthRoutes";
import { createAccountRoutes } from "./accountRoutes";
import { createClientRoutes } from "./clientRoutes";
import { createOidcRoutes } from "./oidcRoutes";
import { createIdentityRoutes } from "./identityRoutes";

type HttpRegistry =
  ReturnType<typeof HttpFactory.create>;

/**
 * Registers every HTTP route.
 */
export function createRoutes(
  http: HttpRegistry,
): Router {

  const router =
    Router();

  // ==========================================================
  // OAuth
  // ==========================================================

  router.use(

    "/oauth",

    createOAuthRoutes(
      http.oauth,
    ),

  );

  // ==========================================================
  // Identity API
  // ==========================================================

  router.use(
    "/identity",
    createIdentityRoutes(http.identity),
  );

  // ==========================================================
  // Accounts
  // ==========================================================

  router.use(
    "/accounts",
    createAccountRoutes(http.identity),
  );

  // ==========================================================
  // OAuth Clients
  // ==========================================================

  router.use(

    "/clients",

    createClientRoutes(
      http.clients,
    ),

  );

  // ==========================================================
  // OpenID Connect
  // ==========================================================

  router.use(

    "/",

    createOidcRoutes(
      http.oidc,
    ),

  );

  return router;

}