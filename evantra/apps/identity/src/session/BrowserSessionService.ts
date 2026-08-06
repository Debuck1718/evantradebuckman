import {
  BrowserSession,
} from "./BrowserSession";

import {
  BrowserSessionRepository,
} from "./BrowserSessionRepository";

import {
  EvantraId,
} from "../account";

/**
 * Coordinates Browser Session
 * persistence and lifecycle.
 */
export class BrowserSessionService {

  constructor(

    private readonly repository:
      BrowserSessionRepository,

  ) {}

  /**
   * Creates a Browser Session.
   */
  async create(
    session: BrowserSession,
  ): Promise<BrowserSession> {

    await this.repository.create(
      session,
    );

    return session;

  }

  /**
   * Persists changes.
   */
  async update(
    session: BrowserSession,
  ): Promise<void> {

    await this.repository.update(
      session,
    );

  }

  /**
   * Finds a Browser Session
   * by its identifier.
   */
  async findById(
    id: string,
  ): Promise<BrowserSession | null> {

    return this.repository.findById(
      id,
    );

  }

  /**
   * Finds a Browser Session
   * by its Session ID.
   */
  async findBySessionId(
    sessionId: string,
  ): Promise<BrowserSession | null> {

    return this.repository.findBySessionId(
      sessionId,
    );

  }

  /**
   * Returns every Browser Session
   * belonging to an Account.
   */
  async findByAccountId(
    accountId: string,
  ): Promise<BrowserSession[]> {

    return this.repository.findByAccountId(
      accountId,
    );

  }

  /**
   * Returns every Browser Session
   * belonging to an Evantra ID.
   *
   * @deprecated Prefer findByAccountId().
   */
  async findByEvantraId(
    evantraId: EvantraId,
  ): Promise<BrowserSession[]> {

    return this.repository.findByEvantraId(
      evantraId,
    );

  }

  /**
   * Returns every Browser Session
   * belonging to an OAuth Client.
   */
  async findByClientId(
    clientId: string,
  ): Promise<BrowserSession[]> {

    return this.repository.findByClientId(
      clientId,
    );

  }

  /**
   * Revokes a Browser Session.
   */
  async revoke(
    session: BrowserSession,
  ): Promise<void> {

    session.revoke();

    await this.repository.update(
      session,
    );

  }

  /**
   * Terminates a Browser Session.
   */
  async terminate(
    session: BrowserSession,
  ): Promise<void> {

    session.terminate();

    await this.repository.update(
      session,
    );

  }

  /**
   * Updates Browser Session
   * activity.
   */
  async touch(
    session: BrowserSession,
    idleTimeoutAt: Date,
  ): Promise<void> {

    session.touch(
      idleTimeoutAt,
    );

    await this.repository.update(
      session,
    );

  }

  /**
   * Deletes a Browser Session.
   */
  async delete(
    id: string,
  ): Promise<void> {

    await this.repository.delete(
      id,
    );

  }

}