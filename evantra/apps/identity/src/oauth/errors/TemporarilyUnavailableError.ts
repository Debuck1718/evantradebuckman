import { OAuthError } from "./OAuthError";

/**
 * OAuth server is
 * temporarily unavailable.
 */
export class TemporarilyUnavailableError
  extends OAuthError {

  constructor() {

    super(

      "temporarily_unavailable",

      "Service temporarily unavailable.",

    );

  }

}