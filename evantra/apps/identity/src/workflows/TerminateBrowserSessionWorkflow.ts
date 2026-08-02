import {
  BrowserSessionService,
} from "../session";

import {
  SessionAlreadyTerminatedError,
  SessionNotFoundError,
} from "../session/errors";

/**
 * Terminates a Browser Session.
 */
export class TerminateBrowserSessionWorkflow {

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
      session.lifecycle.isTerminated()
    ) {

      throw new SessionAlreadyTerminatedError();

    }

    session.terminate();

    await this.sessions.update(

      session,

    );

  }

}