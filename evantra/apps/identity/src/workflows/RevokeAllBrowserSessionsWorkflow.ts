import {
  BrowserSession,
  BrowserSessionService,
} from "../session";

import {
  EvantraId,
} from "../account";

/**
 * Revokes every Browser Session
 * belonging to an Evantra Identity.
 *
 * Optionally keeps the current
 * Browser Session active.
 */
export class RevokeAllBrowserSessionsWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

  ) {}

  /**
   * Revokes every Browser Session.
   */
  async execute(params: {

    evantraId: EvantraId;

    /**
     * Session to keep active.
     */
    exceptSessionId?: string;

  }): Promise<{

    revoked: number;

    skipped: number;

  }> {

    const sessions =
      await this.sessions.findByEvantraId(

        params.evantraId,

      );

    let revoked = 0;

    let skipped = 0;

    for (const session of sessions) {

      // ============================================
      // Keep Current Session
      // ============================================

      if (

        params.exceptSessionId &&

        session.identity.sessionId ===
        params.exceptSessionId

      ) {

        skipped++;

        continue;

      }

      // ============================================
      // Ignore Revoked Sessions
      // ============================================

      if (
        session.lifecycle.isRevoked()
      ) {

        skipped++;

        continue;

      }

      // ============================================
      // Ignore Terminated Sessions
      // ============================================

      if (
        session.lifecycle.isTerminated()
      ) {

        skipped++;

        continue;

      }

      // ============================================
      // Revoke Session
      // ============================================

      session.revoke();

      await this.sessions.update(

        session,

      );

      revoked++;

    }

    return {

      revoked,

      skipped,

    };

  }

}