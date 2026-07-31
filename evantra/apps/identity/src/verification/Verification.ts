/**
 * Represents an account
 * verification request.
 *
 * Verification is responsible
 * for confirming ownership of
 * a contact email.
 */
export class Verification {

  private constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    private verifiedAt: Date | null,
    public readonly createdAt: Date
  ) {}

  /**
   * Creates a new verification.
   */
  static create(params: {
    id: string;
    accountId: string;
    token: string;
    expiresAt: Date;
  }): Verification {

    return new Verification(
      params.id,
      params.accountId,
      params.token,
      params.expiresAt,
      null,
      new Date()
    );
  }

  /**
   * Restores an existing verification
   * from persistent storage.
   */
  static restore(params: {
    id: string;
    accountId: string;
    token: string;
    expiresAt: Date;
    verifiedAt: Date | null;
    createdAt: Date;
  }): Verification {

    return new Verification(
      params.id,
      params.accountId,
      params.token,
      new Date(params.expiresAt),
      params.verifiedAt
        ? new Date(params.verifiedAt)
        : null,
      new Date(params.createdAt)
    );
  }

  isVerified(): boolean {
    return this.verifiedAt !== null;
  }

  hasExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  verify(): void {

    if (this.isVerified()) {
      throw new Error(
        "Verification has already been completed."
      );
    }

    if (this.hasExpired()) {
      throw new Error(
        "Verification has expired."
      );
    }

    this.verifiedAt = new Date();
  }

  verified(): Date | null {
    return this.verifiedAt;
  }

}