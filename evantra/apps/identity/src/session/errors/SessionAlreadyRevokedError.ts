import { SessionError } from "./SessionError";

/**
 * Browser Session
 * has already
 * been revoked.
 */
export class SessionAlreadyRevokedError
  extends SessionError {

  constructor() {

    super(

      "session_already_revoked",

      "Browser Session has already been revoked.",

    );

  }

}