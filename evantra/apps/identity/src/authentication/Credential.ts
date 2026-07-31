/**
 * Represents the authentication
 * credential associated with an
 * Evantra Account.
 *
 * A Credential never stores a
 * plain-text password.
 */
export class Credential {

  /**
   * Creates a Credential.
   */
  private constructor(
    public readonly accountId: string,
    private passwordHash: string,
    public readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  /**
   * Creates a new Credential.
   */
  static create(params: {
    accountId: string;
    passwordHash: string;
  }): Credential {

    const now = new Date();

    return new Credential(
      params.accountId,
      params.passwordHash,
      now,
      now
    );
  }

  /**
   * Restores an existing Credential
   * from persistent storage.
   */
  static restore(params: {
    accountId: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }): Credential {

    return new Credential(
      params.accountId,
      params.passwordHash,
      new Date(params.createdAt),
      new Date(params.updatedAt)
    );
  }

  /**
   * Returns the current
   * password hash.
   */
  hash(): string {
    return this.passwordHash;
  }

  /**
   * Changes the password hash.
   */
  changePassword(
    passwordHash: string
  ): void {

    this.passwordHash = passwordHash;

    this.touch();
  }

  /**
   * Returns the last update time.
   */
  updated(): Date {
    return this.updatedAt;
  }

  /**
   * Updates the modification time.
   */
  private touch(): void {
    this.updatedAt = new Date();
  }

}