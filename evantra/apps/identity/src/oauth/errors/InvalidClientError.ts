import { OAuthError } from "./OAuthError";

/**
 * Client authentication failed.
 */
export class InvalidClientError
  extends OAuthError {

  constructor() {

    super(

      "invalid_client",

      "Client authentication failed.",

    );

  }

}