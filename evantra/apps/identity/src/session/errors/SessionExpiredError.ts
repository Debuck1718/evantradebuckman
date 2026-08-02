import { SessionError } from "./SessionError";

/**
 * Browser Session
 * has expired.
 */
export class SessionExpiredError
  extends SessionError {

  constructor() {

    super(

      "session_expired",

      "Browser Session has expired.",

    );

  }

}