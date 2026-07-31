import { Session } from "./Session";

/**
 * Defines the persistence contract
 * for authenticated sessions.
 */
export interface SessionRepository {

  /**
   * Creates a new session.
   */
  create(
    session: Session
  ): Promise<void>;

  /**
   * Persists changes to
   * an existing session.
   */
  update(
    session: Session
  ): Promise<void>;

  /**
   * Finds a session by
   * its unique identifier.
   */
  findById(
    id: string
  ): Promise<Session | null>;

  /**
   * Returns all active sessions
   * for an account.
   */
  findByAccountId(
    accountId: string
  ): Promise<Session[]>;

  /**
   * Removes a session.
   */
  delete(
    id: string
  ): Promise<void>;
}