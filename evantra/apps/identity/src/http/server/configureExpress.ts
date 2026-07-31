import express, {
  Express,
} from "express";

import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import { LoggingMiddleware } from "../middleware/LoggingMiddleware";
import { RequestIdMiddleware } from "../middleware/RequestIdMiddleware";

export function configureExpress(): Express {

  const app =
    express();

  //
  // Security
  //
  app.disable(
    "x-powered-by",
  );

  app.use(
    helmet(),
  );

  app.use(
    cors({

      origin: true,

      credentials: true,

    }),
  );

  //
  // Infrastructure
  //
  app.use(
    LoggingMiddleware,
  );

  app.use(
    RequestIdMiddleware,
  );

  app.use(
    compression(),
  );

  app.use(
    cookieParser(),
  );

  //
  // Parsers
  //
  app.use(
    express.json({

      limit: "1mb",

    }),
  );

  app.use(
    express.urlencoded({

      extended: true,

    }),
  );

  return app;

}