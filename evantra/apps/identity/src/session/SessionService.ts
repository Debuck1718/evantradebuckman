import { Session } from "./Session";
import { SessionRepository } from "./SessionRepository";
import { Clock } from "../platform/Clock";
import { IdGenerator } from "../platform/IdGenerator";

/**
 * Coordinates authenticated
 * sessions.
 */
export class SessionService {

  constructor(
    private readonly repository: SessionRepository,
    private readonly ids: IdGenerator,
    private readonly clock: Clock
  ) {}

  /**
   * Starts a new session.
   */
  async start(
    accountId: string
  ): Promise<Session> {

    const session =
      Session.create({
        id: this.ids.session(),
        accountId,
        expiresAt: this.clock.afterMinutes(60 * 24 * 30),
      });

    await this.repository.create(
      session
    );

    return session;
  }

  /**
   * Finds a session.
   */
  async findById(
    id: string
  ): Promise<Session | null> {

    return this.repository.findById(id);
  }

  /**
   * Returns all sessions for
   * an account.
   */
  async findByAccountId(
    accountId: string
  ): Promise<Session[]> {

    return this.repository.findByAccountId(
      accountId
    );
  }

  /**
   * Ends a session.
   */
  async end(
    session: Session
  ): Promise<void> {

    session.end();

    await this.repository.update(
      session
    );
  }

  /**
   * Deletes a session.
   */
  async delete(
    id: string
  ): Promise<void> {

    await this.repository.delete(id);
  }
}