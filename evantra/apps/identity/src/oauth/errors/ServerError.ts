import { OAuthError } from "./OAuthError";

/**
 * Internal OAuth server error.
 */
export class ServerError
  extends OAuthError {

  constructor() {

    super(

      "server_error",

      "Internal server error.",

    );

  }

}