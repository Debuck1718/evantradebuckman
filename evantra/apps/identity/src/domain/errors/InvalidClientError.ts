import { OAuthError } from "./OAuthError";

/**
 * RFC6749
 *
 * invalid_client
 */
export class InvalidClientError
  extends OAuthError {

  constructor() {

    super(

      "Client authentication failed.",

      "invalid_client",

      401,

    );

  }

}