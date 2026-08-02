import { SessionError } from "./SessionError";

/**
 * Browser Session
 * has been revoked.
 */
export class SessionRevokedError
  extends SessionError {

  constructor() {

    super(

      "session_revoked",

      "Browser Session has been revoked.",

    );

  }

}