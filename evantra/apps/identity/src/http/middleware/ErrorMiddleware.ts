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

    /*
     * A missing session is an authentication
     * condition, not a missing resource.
     *
     * "session_not_found" is returned when the
     * browser presents a stale, expired or
     * unknown session cookie. Answering 404
     * made the front end treat a normal
     * signed-out state as a broken route and
     * also tripped server logs and monitors
     * with false 404 alerts.
     *
     * Every session failure that simply means
     * "you are not signed in" must be 401 so
     * callers can react by sending the visitor
     * to sign in again.
     */
    const unauthorizedCodes = [
      "session_not_found",
      "session_expired",
      "session_idle_timeout",
      "session_locked",
      "session_revoked",
      "session_terminated",
      "step_up_required",
    ];

    const status =
      unauthorizedCodes.includes(
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