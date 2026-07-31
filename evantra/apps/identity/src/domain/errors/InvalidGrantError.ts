import { OAuthError } from "./OAuthError";

/**
 * RFC6749
 *
 * invalid_grant
 */
export class InvalidGrantError
  extends OAuthError {

  constructor(

    message =
      "Invalid grant.",

  ) {

    super(

      message,

      "invalid_grant",

      400,

    );

  }

}