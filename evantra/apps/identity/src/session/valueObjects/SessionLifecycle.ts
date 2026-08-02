import {
  SessionStatus,
} from "../enums/SessionStatus";

/**
 * Represents the lifecycle of a
 * Browser Session.
 *
 * All time-based session rules
 * are managed here.
 */
export class SessionLifecycle {

  private constructor(

    /**
     * Session creation time.
     */
    public readonly createdAt: Date,

    /**
     * Last activity.
     */
    private lastActivityAt: Date,

    /**
     * Absolute expiration.
     */
    private expiresAt: Date,

    /**
     * Idle timeout.
     */
    private idleTimeoutAt: Date,

    /**
     * Revocation time.
     */
    private revokedAt: Date | null,

    /**
     * Termination time.
     */
    private terminatedAt: Date | null,

    /**
     * Current session status.
     */
    private status: SessionStatus,

  ) {}

  /**
   * Creates a new lifecycle.
   */
  static create(params: {

    expiresAt: Date;

    idleTimeoutAt: Date;

  }): SessionLifecycle {

    const now =
      new Date();

    return new SessionLifecycle(

      now,

      now,

      new Date(
        params.expiresAt,
      ),

      new Date(
        params.idleTimeoutAt,
      ),

      null,

      null,

      SessionStatus.ACTIVE,

    );

  }

  /**
   * Restores persisted lifecycle.
   */
  static restore(params: {

    createdAt: Date;

    lastActivityAt: Date;

    expiresAt: Date;

    idleTimeoutAt: Date;

    revokedAt: Date | null;

    terminatedAt: Date | null;

    status: SessionStatus;

  }): SessionLifecycle {

    return new SessionLifecycle(

      new Date(params.createdAt),

      new Date(params.lastActivityAt),

      new Date(params.expiresAt),

      new Date(params.idleTimeoutAt),

      params.revokedAt
        ? new Date(params.revokedAt)
        : null,

      params.terminatedAt
        ? new Date(params.terminatedAt)
        : null,

      params.status,

    );

  }

  /**
   * Updates session activity.
   */
  touch(
    idleTimeoutAt: Date,
  ): void {

    const now =
      new Date();

    this.lastActivityAt =
      now;

    this.idleTimeoutAt =
      new Date(
        idleTimeoutAt,
      );

  }

  /**
   * Returns the last activity.
   */
  lastActivity(): Date {

    return new Date(
      this.lastActivityAt,
    );

  }

  /**
 * Returns the creation time.
 */
getCreatedAt(): Date {

  return new Date(
    this.createdAt,
  );

}

/**
 * Returns the absolute
 * expiration time.
 */
getExpiresAt(): Date {

  return new Date(
    this.expiresAt,
  );

}

/**
 * Returns the idle timeout.
 */
getIdleTimeoutAt(): Date {

  return new Date(
    this.idleTimeoutAt,
  );

}

/**
 * Returns the revocation time.
 */
getRevokedAt(): Date | null {

  return this.revokedAt
    ? new Date(this.revokedAt)
    : null;

}

/**
 * Returns the termination time.
 */
getTerminatedAt(): Date | null {

  return this.terminatedAt
    ? new Date(this.terminatedAt)
    : null;

}

  /**
   * Returns true if the session
   * has expired.
   */
  hasExpired(): boolean {

    return new Date() >=
      this.expiresAt;

  }

  /**
   * Returns true if the session
   * has exceeded its idle timeout.
   */
  hasIdleTimedOut(): boolean {

    return new Date() >=
      this.idleTimeoutAt;

  }

  /**
   * Revokes the session.
   */
  revoke(): void {

    if (this.revokedAt) {
      return;
    }

    this.revokedAt =
      new Date();

    this.status =
      SessionStatus.REVOKED;

  }

  /**
   * Terminates the session.
   */
  terminate(): void {

    if (this.terminatedAt) {
      return;
    }

    this.terminatedAt =
      new Date();

    this.status =
      SessionStatus.TERMINATED;

  }

  /**
   * Marks the session as idle.
   */
  markIdle(): void {

    this.status =
      SessionStatus.IDLE;

  }

  /**
   * Activates the session.
   */
  activate(): void {

    this.status =
      SessionStatus.ACTIVE;

  }

  /**
   * Returns the current status.
   */
  currentStatus(): SessionStatus {

    return this.status;

  }

  /**
   * Returns true if the session
   * can still be used.
   */
  isActive(): boolean {

    return (

      this.status ===
        SessionStatus.ACTIVE &&

      !this.hasExpired() &&

      !this.hasIdleTimedOut() &&

      this.revokedAt === null &&

      this.terminatedAt === null

    );

  }

  /**
   * Returns true if revoked.
   */
  isRevoked(): boolean {

    return this.revokedAt !==
      null;

  }

  /**
   * Returns true if terminated.
   */
  isTerminated(): boolean {

    return this.terminatedAt !==
      null;

  }

}