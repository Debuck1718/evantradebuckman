import { OAuthError } from "./OAuthError";

/**
 * Invalid OAuth scope.
 */
export class InvalidScopeError
  extends OAuthError {

  constructor() {

    super(

      "invalid_scope",

      "Invalid scope.",

    );

  }

}