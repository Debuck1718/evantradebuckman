/**
 * Represents a pending
 * contact email change.
 */
export class EmailChange {

  private constructor(

    public readonly id: string,

    public readonly accountId: string,

    public readonly newContactEmail: string,

    public readonly token: string,

    public readonly expiresAt: Date,

    private verifiedAt: Date | null,

    public readonly createdAt: Date,

  ) {}

  /**
   * Creates a new request.
   */
  static create(params: {

    id: string;

    accountId: string;

    newContactEmail: string;

    token: string;

    expiresAt: Date;

  }): EmailChange {

    return new EmailChange(

      params.id,

      params.accountId,

      params.newContactEmail,

      params.token,

      params.expiresAt,

      null,

      new Date(),

    );

  }

  /**
   * Restores a persisted request.
   */
  static restore(params: {

    id: string;

    accountId: string;

    newContactEmail: string;

    token: string;

    expiresAt: Date;

    verifiedAt: Date | null;

    createdAt: Date;

  }): EmailChange {

    return new EmailChange(

      params.id,

      params.accountId,

      params.newContactEmail,

      params.token,

      new Date(params.expiresAt),

      params.verifiedAt
        ? new Date(params.verifiedAt)
        : null,

      new Date(params.createdAt),

    );

  }

  /**
   * Returns true when verified.
   */
  isVerified(): boolean {

    return this.verifiedAt !== null;

  }

  /**
   * Returns true when expired.
   */
  hasExpired(): boolean {

    return new Date() > this.expiresAt;

  }

  /**
   * Marks the request verified.
   */
  verify(): void {

    if (this.isVerified()) {

      throw new Error(
        "Email change has already been verified.",
      );

    }

    if (this.hasExpired()) {

      throw new Error(
        "Email change request has expired.",
      );

    }

    this.verifiedAt =
      new Date();

  }

  /**
   * Returns verification time.
   */
  verifiedAtDate(): Date | null {

    return this.verifiedAt
      ? new Date(this.verifiedAt)
      : null;

  }

}