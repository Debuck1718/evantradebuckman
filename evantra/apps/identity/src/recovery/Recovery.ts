/**
 * Represents a password recovery
 * request for an Evantra Account.
 *
 * A recovery request grants a user
 * permission to reset their password.
 */
export class Recovery {

  /**
   * Creates a Recovery request.
   */
  private constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    private usedAt: Date | null,
    public readonly createdAt: Date
  ) {}

  /**
   * Creates a new recovery request.
   */
  static create(params: {
    id: string;
    accountId: string;
    token: string;
    expiresAt: Date;
  }): Recovery {

    return new Recovery(
      params.id,
      params.accountId,
      params.token,
      params.expiresAt,
      null,
      new Date()
    );
  }

  /**
   * Restores an existing recovery
   * request from persistent storage.
   *
   * Intended for repository
   * implementations.
   */
  static restore(params: {
    id: string;
    accountId: string;
    token: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt: Date;
  }): Recovery {

    return new Recovery(
      params.id,
      params.accountId,
      params.token,
      new Date(params.expiresAt),
      params.usedAt
        ? new Date(params.usedAt)
        : null,
      new Date(params.createdAt)
    );
  }

  /**
   * Returns true if the recovery
   * request has already been used.
   */
  isUsed(): boolean {
    return this.usedAt !== null;
  }

  /**
   * Returns true if the recovery
   * request has expired.
   */
  hasExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Marks the recovery request
   * as used.
   */
  use(): void {

    if (this.isUsed()) {
      throw new Error(
        "Recovery request has already been used."
      );
    }

    if (this.hasExpired()) {
      throw new Error(
        "Recovery request has expired."
      );
    }

    this.usedAt = new Date();
  }

  /**
   * Returns the time the recovery
   * request was used.
   */
  used(): Date | null {
    return this.usedAt;
  }

}

