import { OAuthError } from "./OAuthError";

/**
 * RFC6749
 *
 * unauthorized_client
 */
export class UnauthorizedClientError
  extends OAuthError {

  constructor() {

    super(

      "Client is not authorized.",

      "unauthorized_client",

      401,

    );

  }

}