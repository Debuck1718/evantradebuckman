import {
  BrowserSession,
  BrowserSessionService,
} from "../session";

import {
  SessionNotFoundError,
  SessionExpiredError,
  SessionIdleTimeoutError,
  SessionRevokedError,
  SessionTerminatedError,
  SessionLockedError,
} from "../session/errors";

import {
  Clock,
} from "../platform/Clock";

/**
 * Refreshes a Browser Session.
 *
 * This workflow extends the
 * idle timeout after successful
 * authentication.
 */
export class RefreshBrowserSessionWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

    private readonly clock:
      Clock,

) {}

  /**
   * Refreshes the Browser Session.
   */
  async execute(params: {

    sessionId: string;

  }): Promise<BrowserSession> {

    const session =
      await this.sessions.findBySessionId(

        params.sessionId,

      );

    // ==================================================
    // Session Exists
    // ==================================================

    if (!session) {

      throw new SessionNotFoundError();

    }

    // ==================================================
    // Session State
    // ==================================================

    if (
      session.lifecycle.hasExpired()
    ) {

      throw new SessionExpiredError();

    }

    if (
      session.lifecycle.hasIdleTimedOut()
    ) {

      throw new SessionIdleTimeoutError();

    }

    if (
      session.lifecycle.isRevoked()
    ) {

      throw new SessionRevokedError();

    }

    if (
      session.lifecycle.isTerminated()
    ) {

      throw new SessionTerminatedError();

    }

    if (
      session.security.isLocked()
    ) {

      throw new SessionLockedError();

    }

    // ==================================================
    // Refresh Session
    // ==================================================

    const idleTimeoutAt = this.clock.now();

    session.touch(
      idleTimeoutAt,
    );

    await this.sessions.update(

      session,

    );

    return session;

  }

}