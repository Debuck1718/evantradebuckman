import { OAuthError } from "./OAuthError";

/**
 * Unsupported OAuth grant.
 */
export class UnsupportedGrantTypeError
  extends OAuthError {

  constructor() {

    super(

      "unsupported_grant_type",

      "Unsupported grant type.",

    );

  }

}