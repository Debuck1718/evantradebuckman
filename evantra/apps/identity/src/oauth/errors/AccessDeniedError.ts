import { OAuthError } from "./OAuthError";

/**
 * Resource owner denied
 * the authorization request.
 */
export class AccessDeniedError
  extends OAuthError {

  constructor() {

    super(

      "access_denied",

      "Access denied.",

    );

  }

}