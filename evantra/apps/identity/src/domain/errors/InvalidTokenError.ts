import { OAuthError } from "./OAuthError";

/**
 * Invalid token.
 */
export class InvalidTokenError
  extends OAuthError {

  constructor() {

    super(

      "Invalid token.",

      "invalid_token",

      401,

    );

  }

}