import { SessionError } from "./SessionError";

/**
 * Browser Session
 * exceeded its idle timeout.
 */
export class SessionIdleTimeoutError
  extends SessionError {

  constructor() {

    super(

      "session_idle_timeout",

      "Browser Session has exceeded its idle timeout.",

    );

  }

}