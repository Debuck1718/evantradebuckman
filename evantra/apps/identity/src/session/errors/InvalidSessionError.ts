import { SessionError } from "./SessionError";

/**
 * The supplied Browser
 * Session identifier
 * is invalid.
 */
export class InvalidSessionError
  extends SessionError {

  constructor() {

    super(

      "invalid_session",

      "The supplied Browser Session is invalid.",

    );

  }

}