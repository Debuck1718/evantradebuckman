import { SessionError } from "./SessionError";

/**
 * Browser Session
 * has been terminated.
 */
export class SessionTerminatedError
  extends SessionError {

  constructor() {

    super(

      "session_terminated",

      "Browser Session has been terminated.",

    );

  }

}