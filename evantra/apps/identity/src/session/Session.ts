/**
 * Represents an authenticated
 * session for an Evantra Account.
 */
export class Session {

  /**
   * Creates a Session.
   */
  private constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly createdAt: Date,
    public readonly expiresAt: Date,
    private endedAt: Date | null
  ) {}

  /**
   * Creates a new session.
   */
  static create(params: {
    id: string;
    accountId: string;
    expiresAt: Date;
  }): Session {

    return new Session(
      params.id,
      params.accountId,
      new Date(),
      params.expiresAt,
      null
    );
  }

  /**
   * Restores an existing Session
   * from persistent storage.
   *
   * Intended for repository
   * implementations.
   */
  static restore(params: {
    id: string;
    accountId: string;
    createdAt: Date;
    expiresAt: Date;
    endedAt: Date | null;
  }): Session {

    return new Session(
      params.id,
      params.accountId,
      new Date(params.createdAt),
      new Date(params.expiresAt),
      params.endedAt
        ? new Date(params.endedAt)
        : null
    );
  }

  /**
   * Returns true if the
   * session has ended.
   */
  isEnded(): boolean {
    return this.endedAt !== null;
  }

  /**
   * Returns true if the
   * session has expired.
   */
  hasExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Returns true if the
   * session is active.
   */
  isActive(): boolean {
    return (
      !this.isEnded() &&
      !this.hasExpired()
    );
  }

  /**
   * Ends the session.
   */
  end(): void {

    if (this.isEnded()) {
      throw new Error(
        "Session has already ended."
      );
    }

    this.endedAt = new Date();
  }

  /**
   * Returns the time the
   * session ended.
   */
  ended(): Date | null {
    return this.endedAt;
  }

}