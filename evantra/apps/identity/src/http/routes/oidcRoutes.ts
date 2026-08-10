import { Router } from "express";

import { HttpFactory } from "../../factory/HttpFactory";

type OidcRegistry =
  ReturnType<typeof HttpFactory.create>["oidc"];

export function createOidcRoutes(
  oidc: OidcRegistry,
): Router {

  const router = Router();

  router.get(
    "/.well-known/openid-configuration",
    oidc.controllers.discovery.handle.bind(
      oidc.controllers.discovery,
    ),
  );

  router.get(
    "/.well-known/jwks.json",
    oidc.controllers.jwks.handle.bind(
      oidc.controllers.jwks,
    ),
  );

  return router;

}