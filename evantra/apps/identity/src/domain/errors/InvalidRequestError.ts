import { OAuthError } from "./OAuthError";

/**
 * RFC6749
 *
 * invalid_request
 */
export class InvalidRequestError
  extends OAuthError {

  constructor(

    message =
      "Invalid request.",

  ) {

    super(

      message,

      "invalid_request",

      400,

    );

  }

}