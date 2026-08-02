import {
  BrowserSession,
  BrowserSessionService,
} from "../session";

import {
  SessionIdentity,
  SessionAuthentication,
  SessionDevice,
  SessionNetwork,
  SessionSecurity,
  SessionLifecycle,
} from "../session";

import {
  SessionNotFoundError,
  SessionRevokedError,
} from "../session/errors";

/**
 * Rotates a Browser Session.
 *
 * A new Browser Session is issued
 * while the previous session is
 * revoked.
 *
 * This protects against session
 * fixation attacks.
 */
export class RotateBrowserSessionWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

  ) {}

  /**
   * Rotates the Browser Session.
   */
  async execute(params: {

    currentSessionId: string;

    identity: SessionIdentity;

    authentication: SessionAuthentication;

    device: SessionDevice;

    network: SessionNetwork;

    security: SessionSecurity;

    lifecycle: SessionLifecycle;

  }): Promise<BrowserSession> {

    // ==================================================
    // Existing Session
    // ==================================================

    const current =
      await this.sessions.findBySessionId(

        params.currentSessionId,

      );

    if (!current) {

      throw new SessionNotFoundError();

    }

    if (
      current.lifecycle.isRevoked()
    ) {

      throw new SessionRevokedError();

    }

    // ==================================================
    // Revoke Current Session
    // ==================================================

    current.revoke();

    await this.sessions.update(

      current,

    );

    // ==================================================
    // Create Replacement Session
    // ==================================================

    const replacement =
      BrowserSession.create({

        identity:
          params.identity,

        authentication:
          params.authentication,

        device:
          params.device,

        network:
          params.network,

        security:
          params.security,

        lifecycle:
          params.lifecycle,

      });

    await this.sessions.create(

      replacement,

    );

    return replacement;

  }

}