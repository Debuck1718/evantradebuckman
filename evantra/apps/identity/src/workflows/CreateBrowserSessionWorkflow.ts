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

/**
 * Creates a new
 * Browser Session.
 */
export class CreateBrowserSessionWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

  ) {}

  /**
   * Creates and persists
   * a Browser Session.
   */
  async execute(params: {

    identity: SessionIdentity;

    authentication: SessionAuthentication;

    device: SessionDevice;

    network: SessionNetwork;

    security: SessionSecurity;

    lifecycle: SessionLifecycle;

  }): Promise<BrowserSession> {

    const session =
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
      session,
    );

    return session;

  }

}