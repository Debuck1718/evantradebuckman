import { OAuthError } from "./OAuthError";

/**
 * Invalid OAuth scope.
 *
 * Raised only when a scope string was actually
 * supplied or resolved and could not be honoured.
 *
 * A request that omits `scope` entirely is NOT a
 * scope error: RFC6749 section 3.3 makes the
 * parameter optional. The authorization endpoint
 * resolves the client's registered default set
 * instead. Using invalid_scope for a missing
 * parameter sends integrators hunting for a bad
 * scope string they never sent — which is exactly
 * the detour this message used to cause.
 */
export class InvalidScopeError
  extends OAuthError {

  constructor(

    message = "The requested scope is not registered for this client.",

  ) {

    super(

      "invalid_scope",

      message,

    );

  }

}