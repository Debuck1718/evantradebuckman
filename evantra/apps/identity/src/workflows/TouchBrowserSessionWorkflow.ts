import {
  BrowserSession,
  BrowserSessionService,
} from "../session";

import {
  SessionNotFoundError,
} from "../session/errors";

/**
 * Updates Browser Session
 * activity.
 */
export class TouchBrowserSessionWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

  ) {}

  /**
   * Updates the Browser
   * Session activity.
   */
  async execute(params: {

    sessionId: string;

    idleTimeoutAt: Date;

  }): Promise<BrowserSession> {

    const session =
      await this.sessions.findBySessionId(

        params.sessionId,

      );

    if (!session) {

      throw new SessionNotFoundError();

    }

    session.touch(

      params.idleTimeoutAt,

    );

    await this.sessions.update(

      session,

    );

    return session;

  }

}