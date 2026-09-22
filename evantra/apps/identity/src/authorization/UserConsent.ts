/**
 * Represents a user's consent for an
 * OAuth client to hold a specific scope.
 *
 * One row is stored per granted scope, which
 * mirrors the unique index on
 * (account_id, client_id, scope).
 *
 * Consent is recorded when the resource owner
 * approves an authorization request and can be
 * revoked later without destroying the record,
 * so the audit trail survives.
 *
 * RFC6749 section 4.1.1
 */
export class UserConsent {

  private constructor(

    /**
     * Internal identifier.
     */
    public readonly id: string,

    /**
     * Account that granted consent.
     */
    public readonly accountId: string,

    /**
     * OAuth client the consent was
     * granted to.
     */
    public readonly clientId: string,

    /**
     * The individual scope granted.
     */
    public readonly scope: string,

    /**
     * When consent was granted.
     */
    public readonly grantedAt: Date,

    /**
     * When consent was revoked.
     *
     * Null while the consent is active.
     */
    private revokedAt: Date | null,

  ) { }

  /**
   * Grants a new consent.
   */
  static grant(params: {

    id: string;

    accountId: string;

    clientId: string;

    scope: string;

    grantedAt: Date;

  }): UserConsent {

    return new UserConsent(

      params.id,

      params.accountId,

      params.clientId,

      params.scope,

      params.grantedAt,

      null,

    );

  }

  /**
   * Restores a consent from storage.
   */
  static restore(params: {

    id: string;

    accountId: string;

    clientId: string;

    scope: string;

    grantedAt: Date;

    revokedAt: Date | null;

  }): UserConsent {

    return new UserConsent(

      params.id,

      params.accountId,

      params.clientId,

      params.scope,

      params.grantedAt,

      params.revokedAt,

    );

  }

  /**
   * True while the consent is active.
   */
  isActive(): boolean {

    return this.revokedAt === null;

  }

  /**
   * Returns when the consent
   * was revoked.
   */
  getRevokedAt(): Date | null {

    return this.revokedAt;

  }

  /**
   * Revokes the consent.
   *
   * Idempotent: revoking an already
   * revoked consent is a no-op.
   */
  revoke(
    revokedAt: Date,
  ): void {

    if (this.revokedAt !== null) {

      return;

    }

    this.revokedAt = revokedAt;

  }

  /**
   * Re-activates a previously
   * revoked consent.
   *
   * Used when a user approves a client
   * again after having revoked it.
   */
  reinstate(): void {

    this.revokedAt = null;

  }

}