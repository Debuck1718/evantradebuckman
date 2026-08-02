import { SessionError } from "./SessionError";

/**
 * Browser Session
 * has already
 * been terminated.
 */
export class SessionAlreadyTerminatedError
  extends SessionError {

  constructor() {

    super(

      "session_already_terminated",

      "Browser Session has already been terminated.",

    );

  }

}