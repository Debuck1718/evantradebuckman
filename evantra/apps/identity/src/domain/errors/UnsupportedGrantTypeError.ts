import { OAuthError } from "./OAuthError";

/**
 * RFC6749
 *
 * unsupported_grant_type
 */
export class UnsupportedGrantTypeError
  extends OAuthError {

  constructor() {

    super(

      "Unsupported grant type.",

      "unsupported_grant_type",

      400,

    );

  }

}