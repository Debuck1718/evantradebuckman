import { SessionError } from "./SessionError";

/**
 * Browser Session
 * was not found.
 */
export class SessionNotFoundError
  extends SessionError {

  constructor() {

    super(

      "session_not_found",

      "Browser Session was not found.",

    );

  }

}