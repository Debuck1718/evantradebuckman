import {
  BrowserSession,
  BrowserSessionService,
} from "../session";

import {
  SessionNotFoundError,
} from "../session/errors";

import {
  Clock,
} from "../platform/Clock";

/**
 * Updates Browser Session
 * activity.
 *
 * Extends the idle timeout
 * and records the latest
 * activity timestamp.
 */
export class TouchBrowserSessionWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

    private readonly clock:
      Clock,

  ) {}

  /**
   * Updates the Browser
   * Session activity.
   */
  async execute(params: {

    sessionId: string;

  }): Promise<BrowserSession> {

    // ======================================================
    // Find Session
    // ======================================================

    const session =
      await this.sessions.findBySessionId(

        params.sessionId,

      );

    if (!session) {

      throw new SessionNotFoundError();

    }

    // ======================================================
    // Compute New Idle Timeout
    // ======================================================

    const idleTimeoutAt =
      this.clock.afterMinutes(

        30,

      );

    // ======================================================
    // Update Session Activity
    // ======================================================

    session.touch(

      idleTimeoutAt,

    );

    await this.sessions.update(

      session,

    );

    // ======================================================
    // Result
    // ======================================================

    return session;

  }

}