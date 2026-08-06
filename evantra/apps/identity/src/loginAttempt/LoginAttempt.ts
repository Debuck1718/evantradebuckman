/**
 * Represents failed authentication
 * attempts for an Evantra ID.
 */
export class LoginAttempt {

  private constructor(

    public readonly evantraId: string,

    private attempts: number,

    private lockedUntil: Date | null,

    private lastAttemptAt: Date,

  ) {}

  /**
   * Creates a new record.
   */
  static create(
    evantraId: string,
  ): LoginAttempt {

    return new LoginAttempt(

      evantraId,

      0,

      null,

      new Date(),

    );

  }

  /**
   * Restores a persisted record.
   */
  static restore(params: {

    evantraId: string;

    attempts: number;

    lockedUntil: Date | null;

    lastAttemptAt: Date;

  }): LoginAttempt {

    return new LoginAttempt(

      params.evantraId,

      params.attempts,

      params.lockedUntil
        ? new Date(params.lockedUntil)
        : null,

      new Date(params.lastAttemptAt),

    );

  }

  increment(): void {

    this.attempts++;

    this.lastAttemptAt =
      new Date();

  }

  reset(): void {

    this.attempts = 0;

    this.lockedUntil = null;

    this.lastAttemptAt =
      new Date();

  }

  lock(
    until: Date,
  ): void {

    this.lockedUntil = until;

  }

  isLocked(): boolean {

    return !!this.lockedUntil &&
      this.lockedUntil > new Date();

  }

  getAttempts(): number {

    return this.attempts;

  }

  getLockedUntil(): Date | null {

    return this.lockedUntil;

  }

  getLastAttemptAt(): Date {

    return this.lastAttemptAt;

  }

}