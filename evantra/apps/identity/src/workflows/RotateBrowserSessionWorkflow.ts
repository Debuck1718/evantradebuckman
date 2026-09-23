import {
  BrowserSession,
  BrowserSessionService,
} from "../session";

import {
  SessionNotFoundError,
  SessionRevokedError,
  SessionTerminatedError,
} from "../session/errors";

import {
  IdGenerator,
} from "../platform/IdGenerator";

import {
  Clock,
} from "../platform/Clock";

/**
 * Idle timeout applied when a session is
 * rotated.
 *
 * This must match the window used at sign in.
 * The previous value of 30 minutes silently
 * shortened every rotated session to half an
 * hour, so an active user was signed out far
 * sooner than their session panel claimed.
 */
const BROWSER_SESSION_IDLE_MINUTES =
  Number(
    process.env.SESSION_IDLE_TIMEOUT_MINUTES ??
      60 * 24,
  );

/**
 * Rotates a Browser Session.
 *
 * The current Browser Session
 * is revoked and replaced with
 * a newly issued Browser Session.
 *
 * Protects against session
 * fixation attacks.
 */
export class RotateBrowserSessionWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

    private readonly ids:
      IdGenerator,

    private readonly clock:
      Clock,

  ) {}

  /**
   * Rotates the Browser Session.
   */
  async execute(params: {

    currentSessionId: string;

  }): Promise<BrowserSession> {

    // ======================================================
    // Locate Current Session
    // ======================================================

    const current =
      await this.sessions.findBySessionId(

        params.currentSessionId,

      );

    if (!current) {

      throw new SessionNotFoundError();

    }

    // ======================================================
    // Validate Current Session
    // ======================================================

    if (

      current.lifecycle.isRevoked()

    ) {

      throw new SessionRevokedError();

    }

    if (

      current.lifecycle.isTerminated()

    ) {

      throw new SessionTerminatedError();

    }

    // ======================================================
    // Create Replacement Session
    // ======================================================

    const replacement =
      current.rotate({

        sessionId:

          this.ids.session(),

        authenticatedAt:

          this.clock.now(),

        expiresAt:

          current.lifecycle.getExpiresAt(),

        idleTimeoutAt:

          this.clock.afterMinutes(

            BROWSER_SESSION_IDLE_MINUTES,

          ),

      });

    // ======================================================
    // Revoke Current Session
    // ======================================================

    current.revoke();

    await this.sessions.update(

      current,

    );

    // ======================================================
    // Persist Replacement
    // ======================================================

    await this.sessions.create(

      replacement,

    );

    // ======================================================
    // Return New Session
    // ======================================================

    return replacement;

  }

}