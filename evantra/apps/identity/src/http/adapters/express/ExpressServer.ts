import express, {
  Express,
} from "express";

import cookieParser from "cookie-parser";

import {
  Application,
} from "../../../bootstrap/Application";

import {
  ExpressRouter,
} from "./ExpressRouter";

import {
  ExpressErrorHandler,
} from "./ExpressErrorHandler";

/**
 * Creates the Express server.
 */
export class ExpressServer {

  static create(
    application: ReturnType<typeof Application.create>,
  ): Express {

    const app =
      express();

    app.use(

      express.json(),

    );

    app.use(

      cookieParser(),

    );

    app.use(

      ExpressRouter.create(

        application,

      ),

    );

    app.use(

      ExpressErrorHandler.handle,

    );

    return app;

  }

}