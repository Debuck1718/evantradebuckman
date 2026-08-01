import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  OAuthError,
} from "../../oauth/errors";

/**
 * Serializes OAuth 2.1 errors.
 *
 * RFC6749 Section 5.2
 */
export function OAuthErrorMiddleware(

  error: unknown,

  _request: Request,

  response: Response,

  next: NextFunction,

): void {

  if (!(error instanceof OAuthError)) {

    next(error);

    return;

  }

  //
  // RFC6749
  //
  response.status(

    error.code === "invalid_client"
      ? 401
      : 400,

  );

  response.json({

    error:
      error.code,

    error_description:
      error.message,

    ...(error.uri
      ? {

          error_uri:
            error.uri,

        }
      : {}),

  });

}