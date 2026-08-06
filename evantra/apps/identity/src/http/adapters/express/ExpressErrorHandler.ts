import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  HttpError,
  HttpErrorResponse,
  HttpStatus,
} from "../../";

import {
  SessionExpiredError,
  SessionNotFoundError,
  SessionRevokedError,
  SessionTerminatedError,
} from "../../../session/errors";

import {
  InvalidCredentialsError,
  InactiveAccountError,
  AccountLockedError,
} from "../../../authentication/errors";

/**
 * Global Express
 * error handler.
 */
export class ExpressErrorHandler {

  static handle(

    error: unknown,

    request: Request,

    response: Response,

    next: NextFunction,

  ): void {

    // ======================================================
    // HTTP Errors
    // ======================================================

    if (error instanceof HttpError) {

      const body: HttpErrorResponse = {

        error: {

          code:

            HttpStatus[
              error.status
            ],

          message:
            error.message,

        },

      };

      response
        .status(error.status)
        .json(body);

      return;

    }

    // ======================================================
    // Session Errors
    // ======================================================

    if (
      error instanceof SessionNotFoundError
    ) {

      response
        .status(HttpStatus.NOT_FOUND)
        .json({
          error: {
            code: error.error,
            message: error.description,
          },
        });

      return;

    }

    if (
      error instanceof SessionExpiredError ||
      error instanceof SessionRevokedError ||
      error instanceof SessionTerminatedError
    ) {

      response
        .status(HttpStatus.UNAUTHORIZED)
        .json({
          error: {
            code: error.error,
            message: error.description,
          },
        });

      return;

    }

    // ======================================================
    // Authentication Errors
    // ======================================================

    if (
      error instanceof InvalidCredentialsError
    ) {

      response
        .status(HttpStatus.UNAUTHORIZED)
        .json({
          error: {
            code: error.error,
            message: error.description,
          },
        });

      return;

    }

    if (
      error instanceof InactiveAccountError
    ) {

      response
        .status(HttpStatus.FORBIDDEN)
        .json({
          error: {
            code: error.error,
            message: error.description,
          },
        });

      return;

    }

    if (
      error instanceof AccountLockedError
    ) {

      response
        .status(HttpStatus.LOCKED)
        .json({
          error: {
            code: error.error,
            message: error.description,
          },
        });

      return;

    }

    // ======================================================
    // Unknown Error
    // ======================================================

    console.error(error);

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({

        error: {

          code:
            "INTERNAL_SERVER_ERROR",

          message:
            "An unexpected error occurred.",

        },

      });

  }

}