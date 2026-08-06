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

            30,

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