import { Router } from "express";

import { HttpFactory } from "../../factory/HttpFactory";

type ClientRegistry =
  ReturnType<typeof HttpFactory.create>["clients"];

export function createClientRoutes(
  clients: ClientRegistry,
): Router {

  const router = Router();
  const controllers = clients.controllers;

  router.post(
    "/register",
    controllers.registerClient.handle.bind(
      controllers.registerClient,
    ),
  );

  router.post(
    "/redirect-uris",
    controllers.registerRedirectUri.handle.bind(
      controllers.registerRedirectUri,
    ),
  );

  router.post(
    "/approve",
    controllers.approveClient.handle.bind(
      controllers.approveClient,
    ),
  );

  router.post(
    "/rotate-secret",
    controllers.rotateClientSecret.handle.bind(
      controllers.rotateClientSecret,
    ),
  );

  return router;

}