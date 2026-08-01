import express, {
  Express,
} from "express";

import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import { HttpFactory } from "../../factory/HttpFactory";

import { LoggingMiddleware } from "../middleware/LoggingMiddleware";
import { OAuthErrorMiddleware } from "../middleware/OAuthErrorMiddleware";
import { RequestIdMiddleware } from "../middleware/RequestIdMiddleware";
import { ErrorMiddleware } from "../middleware/ErrorMiddleware";

import { createRoutes } from "../routes";

type HttpRegistry =
  ReturnType<typeof HttpFactory.create>;

/**
 * Configures the Express application.
 *
 * This is the HTTP composition root
 * for Evantra Identity.
 */
export function configureExpress(
  http: HttpRegistry,
): Express {

  const app =
    express();

  // ==========================================================
  // Express
  // ==========================================================

  app.disable(
    "x-powered-by",
  );

  app.set(
    "trust proxy",
    true,
  );

  // ==========================================================
  // Security
  // ==========================================================

  app.use(
    helmet(),
  );

  app.use(
    cors({

      origin: true,

      credentials: true,

    }),
  );

  // ==========================================================
  // Middleware
  // ==========================================================

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

  // ==========================================================
  // Body Parsers
  // ==========================================================

  app.use(
    express.json({

      limit: "1mb",

    }),
  );

  app.use(
    express.urlencoded({

      extended: true,

      limit: "1mb",

    }),
  );

  /**
   * OAuth endpoints occasionally
   * accept text payloads.
   */
  app.use(
    express.text({
      limit: "1mb",
    }),
  );

  /**
   * Reserved for WebAuthn,
   * signed requests and
   * webhook verification.
   */
  app.use(
    express.raw({
      type: "application/octet-stream",
      limit: "2mb",
    }),
  );

  // ==========================================================
  // Health
  // ==========================================================

  app.get(

    "/health",

    (_request, response) => {

      response.status(200).json({

        status: "ok",

        service:
          "Evantra Identity",

        timestamp:
          new Date().toISOString(),

      });

    },

  );

  /**
   * Kubernetes /
   * Docker readiness.
   */
  app.get(

    "/ready",

    (_request, response) => {

      response.sendStatus(200);

    },

  );

  // ==========================================================
  // Routes
  // ==========================================================

  app.use(
    createRoutes(
      http,
    ),
  );

  // ==========================================================
  // 404
  // ==========================================================

  app.use(

    (_request, response) => {

      response.status(404).json({

        error:
          "not_found",

        error_description:
          "Resource not found.",

      });

    },

  );

  // ==========================================================
  // Error Handling
  // ==========================================================

  /**
   * OAuth RFC6749 errors.
   */
  app.use(
    OAuthErrorMiddleware,
  );

  /**
   * Unexpected application errors.
   */
  app.use(
    ErrorMiddleware,
  );

  return app;

}