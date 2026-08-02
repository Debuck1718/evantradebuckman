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
  StepUpAuthenticationRequiredError,
} from "../session/errors";

/**
 * Validates a Browser Session.
 *
 * Every authenticated request
 * passes through this workflow.
 */
export class ValidateBrowserSessionWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

  ) {}

  /**
   * Validates a Browser Session.
   */
  async execute(params: {

    sessionId: string;

  }): Promise<BrowserSession> {

    const session =
      await this.sessions.findBySessionId(

        params.sessionId,

      );

    // ======================================================
    // Session Exists
    // ======================================================

    if (!session) {

      throw new SessionNotFoundError();

    }

    // ======================================================
    // Absolute Expiration
    // ======================================================

    if (
      session.lifecycle.hasExpired()
    ) {

      throw new SessionExpiredError();

    }

    // ======================================================
    // Idle Timeout
    // ======================================================

    if (
      session.lifecycle.hasIdleTimedOut()
    ) {

      throw new SessionIdleTimeoutError();

    }

    // ======================================================
    // Revoked
    // ======================================================

    if (
      session.lifecycle.isRevoked()
    ) {

      throw new SessionRevokedError();

    }

    // ======================================================
    // Terminated
    // ======================================================

    if (
      session.lifecycle.isTerminated()
    ) {

      throw new SessionTerminatedError();

    }

    // ======================================================
    // Locked
    // ======================================================

    if (
      session.security.isLocked()
    ) {

      throw new SessionLockedError();

    }

    // ======================================================
    // Step-up Authentication
    // ======================================================

    if (
      session.requiresStepUp()
    ) {

      throw new StepUpAuthenticationRequiredError();

    }

    return session;

  }

}