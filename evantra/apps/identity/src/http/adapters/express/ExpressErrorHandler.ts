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

    if (

      error instanceof HttpError

    ) {

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

        .status(

          error.status,

        )

        .json(body);

      return;

    }

    console.error(error);

    const body: HttpErrorResponse = {

      error: {

        code:

          "INTERNAL_SERVER_ERROR",

        message:

          "An unexpected error occurred.",

      },

    };

    response

      .status(

        HttpStatus.INTERNAL_SERVER_ERROR,

      )

      .json(body);

  }

}