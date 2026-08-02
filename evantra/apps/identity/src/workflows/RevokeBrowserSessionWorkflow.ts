import {
  BrowserSessionService,
} from "../session";

import {
  SessionNotFoundError,
  SessionAlreadyRevokedError,
} from "../session/errors";

/**
 * Revokes a Browser Session.
 */
export class RevokeBrowserSessionWorkflow {

  constructor(

    private readonly sessions:
      BrowserSessionService,

  ) {}

  async execute(params: {

    sessionId: string;

  }): Promise<void> {

    const session =
      await this.sessions.findBySessionId(

        params.sessionId,

      );

    if (!session) {

      throw new SessionNotFoundError();

    }

    if (
      session.lifecycle.isRevoked()
    ) {

      throw new SessionAlreadyRevokedError();

    }

    session.revoke();

    await this.sessions.update(

      session,

    );

  }

}