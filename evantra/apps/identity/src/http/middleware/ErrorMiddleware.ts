import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  HttpError,
  HttpStatus,
} from "../";

import {
  SessionError,
} from "../../session/errors";

import {
  AuthenticationError,
} from "../../authentication/errors";

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

  if (error instanceof HttpError) {

    response
      .status(
        error.status,
      )
      .json({

        error: {
          code:
            HttpStatus[
              error.status
            ],

          message:
          error.message,

        },

      });

    return;

  }

  if (error instanceof SessionError) {

    const unauthorizedCodes = [
      "session_expired",
      "session_idle_timeout",
      "session_locked",
      "session_revoked",
      "session_terminated",
      "step_up_required",
    ];

    const status =
      error.error === "session_not_found"
        ? HttpStatus.NOT_FOUND
        : unauthorizedCodes.includes(
            error.error,
          )
          ? HttpStatus.UNAUTHORIZED
          : HttpStatus.BAD_REQUEST;

    response
      .status(status)
      .json({

        error: {
          code:
            error.error,

          message:
            error.description,

        },

      });

    return;

  }

  if (error instanceof AuthenticationError) {

    response
      .status(error.status)
      .json({

        error: {
          code:
            error.code,

          message:
            error.message,

        },

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

      error: {
        code:
          "INTERNAL_SERVER_ERROR",

        message:
          "An unexpected error occurred.",

      },

    });

}