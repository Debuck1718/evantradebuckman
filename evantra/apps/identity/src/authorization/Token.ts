/**
 * Represents a persisted security
 * token issued by Evantra Identity.
 *
 * Token provides the common behavior
 * shared by Access Tokens and
 * Refresh Tokens.
 */
export abstract class Token {

  protected constructor(

    /**
     * Internal identifier.
     */
    public readonly id: string,

    /**
     * Account.
     */
    public readonly accountId: string,

    /**
     * OAuth Client.
     */
    public readonly clientId: string,

    /**
     * Granted scopes.
     */
    private readonly grantedScopes: string[],

    /**
     * Expiration.
     */
    public readonly expiresAt: Date,

    /**
     * Revocation timestamp.
     */
    private revokedAt: Date | null,

    /**
     * Creation timestamp.
     */
    public readonly createdAt: Date,

  ) {}

  /**
   * Returns every granted scope.
   */
  scopes(): readonly string[] {

    return [...this.grantedScopes];

  }

  /**
   * Returns true if revoked.
   */
  isRevoked(): boolean {

    return this.revokedAt !== null;

  }

  /**
   * Returns true if expired.
   */
  hasExpired(): boolean {

    return new Date() > this.expiresAt;

  }

  /**
   * Returns true if active.
   */
  isActive(): boolean {

    return !this.isRevoked()
        && !this.hasExpired();

  }

  /**
   * Revokes this token.
   */
  revoke(): void {

    if (this.isRevoked()) {
      throw new Error(
        "Token has already been revoked."
      );
    }

    this.revokedAt =
      new Date();

  }

  /**
   * Returns the revocation time.
   */
  revoked(): Date | null {

    return this.revokedAt;

  }

}