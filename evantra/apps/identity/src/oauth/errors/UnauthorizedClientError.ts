import { OAuthError } from "./OAuthError";

/**
 * Client is not authorized
 * to use this grant.
 */
export class UnauthorizedClientError
  extends OAuthError {

  constructor() {

    super(

      "unauthorized_client",

      "Client is not authorized.",

    );

  }

}