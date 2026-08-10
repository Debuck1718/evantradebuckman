import express, {
  Express,
} from "express";

import {
  Application,
} from "../../../bootstrap/Application";

import {
  configureExpress,
} from "../../server/configureExpress";

/**
 * Creates the Express server.
 */
export class ExpressServer {

  static create(
    application: ReturnType<typeof Application.create>,
  ): Express {

    return configureExpress(
      application.identity.http,
    );

  }

}