import { SessionError } from "./SessionError";

/**
 * Browser Session
 * is locked.
 */
export class SessionLockedError
  extends SessionError {

  constructor() {

    super(

      "session_locked",

      "Browser Session is locked.",

    );

  }

}