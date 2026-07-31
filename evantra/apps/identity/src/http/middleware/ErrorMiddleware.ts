import {
  NextFunction,
  Request,
  Response,
} from "express";

import { DomainError } from "../../domain/errors/DomainError";
import { OAuthError } from "../../domain/errors/OAuthError";

/**
 * Global HTTP error handler.
 *
 * Converts Domain and OAuth
 * exceptions into HTTP responses.
 */
export function ErrorMiddleware(

  error: unknown,

  _request: Request,

  response: Response,

  _next: NextFunction,

): void {

  //
  // OAuth Errors
  //
  if (error instanceof OAuthError) {

    response
      .status(error.status)
      .json({

        error:
          error.error,

        error_description:
          error.message,

      });

    return;

  }

  //
  // Other Domain Errors
  //
  if (error instanceof DomainError) {

    response
      .status(400)
      .json({

        error:
          "domain_error",

        error_description:
          error.message,

      });

    return;

  }

  //
  // Unexpected Errors
  //
  console.error(error);

  response
    .status(500)
    .json({

      error:
        "server_error",

      error_description:
        "An unexpected error occurred.",

    });

}