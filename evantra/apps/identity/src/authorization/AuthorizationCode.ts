import { RedirectUri } from "../client";
import { PkceMethod } from "./PkceMethod";

import {
  InvalidGrantError,
} from "../oauth/errors";
/**
 * Represents an OAuth
 * Authorization Code.
 *
 * Authorization Codes are
 * short-lived, single-use
 * credentials issued after a
 * successful authorization.
 */
export class AuthorizationCode {

  /**
   * Creates an Authorization Code.
   */
  private constructor(

    /**
     * Internal identifier.
     */
    public readonly id: string,

    /**
     * OAuth Client.
     */
    public readonly clientId: string,

    /**
     * Authorized Account.
     */
    public readonly accountId: string,

    /**
     * Redirect URI associated
     * with this authorization.
     */
    public readonly redirectUri: RedirectUri,

    /**
     * Public authorization code.
     */
    public readonly code: string,

    /**
     * PKCE code challenge.
     */
    public readonly codeChallenge: string,

    /**
     * PKCE challenge method.
     */
    public readonly codeChallengeMethod: PkceMethod,

    /**
 * OpenID Connect nonce.
 *
 * Optional until OIDC is used.
 */
   public readonly nonce: string | null,

    /**
     * Granted scopes.
     */
    private readonly grantedScopes: string[],

    /**
     * Expiration time.
     */
    public readonly expiresAt: Date,

    /**
     * Consumption time.
     */
    private consumedAt: Date | null,

    /**
     * Creation time.
     */
    public readonly createdAt: Date

  ) {}

  /**
   * Creates a new Authorization Code.
   */
  static create(params: {

    id: string;

    clientId: string;

    accountId: string;

    redirectUri: RedirectUri;

    code: string;

    codeChallenge: string;

    codeChallengeMethod: PkceMethod;

    nonce?: string | null;

    scopes: string[];

    expiresAt: Date;

  }): AuthorizationCode {

    return new AuthorizationCode(

      params.id,

      params.clientId,

      params.accountId,

      params.redirectUri,

      params.code,

      params.codeChallenge,

      params.codeChallengeMethod,

      params.nonce ?? null,

      [...params.scopes],

      params.expiresAt,

      null,

      new Date()

    );

  }

  /**
   * Restores a persisted
   * Authorization Code.
   */
  static restore(params: {

    id: string;

    clientId: string;

    accountId: string;

    redirectUri: RedirectUri;

    code: string;

    codeChallenge: string;

    codeChallengeMethod: PkceMethod;

    scopes: string[];

    nonce: string | null;

    expiresAt: Date;

    consumedAt: Date | null;

    createdAt: Date;

  }): AuthorizationCode {

    return new AuthorizationCode(

      params.id,

      params.clientId,

      params.accountId,

      params.redirectUri,

      params.code,

      params.codeChallenge,

      params.codeChallengeMethod,

      params.nonce,

      [...params.scopes],

      new Date(params.expiresAt),

      params.consumedAt
        ? new Date(params.consumedAt)
        : null,

      new Date(params.createdAt)

    );

  }

  /**
   * Returns the granted scopes.
   */
  scopes(): readonly string[] {

    return [...this.grantedScopes];

  }
  /**
 * Returns true when the supplied
 * Redirect URI matches the one
 * originally used.
 */
matchesRedirectUri(
  redirectUri: RedirectUri,
): boolean {

  return this.redirectUri.equals(
    redirectUri,
  );

}

/**
 * Returns true if the
 * Authorization Code
 * contains every supplied
 * scope.
 */
hasScopes(
  scopes: readonly string[],
): boolean {

  return scopes.every(

    scope =>
      this.grantedScopes.includes(
        scope,
      ),

  );

}

/**
 * Returns true if this
 * Authorization Code
 * belongs to an Account.
 */
belongsToAccount(
  accountId: string,
): boolean {

  return this.accountId ===
    accountId;

}

/**
 * Returns true if this
 * Authorization Code
 * belongs to a Client.
 */
belongsToClient(
  clientId: string,
): boolean {

  return this.clientId ===
    clientId;

}

  /**
   * Returns true if the code
   * has already been consumed.
   */
  isConsumed(): boolean {

    return this.consumedAt !== null;

  }

  /**
   * Returns true if the code
   * has expired.
   */
  hasExpired(): boolean {

    return new Date() > this.expiresAt;

  }

  /**
 * Returns true if the
 * Authorization Code
 * is expired.
 */
isExpired(): boolean {

  return this.hasExpired();

}

  /**
 * Returns true if the
 * Authorization Code
 * is still active.
 */
isActive(): boolean {

  return !this.isConsumed()
    && !this.hasExpired();

}

  /**
 * Consumes the
 * Authorization Code.
 */
consume(): void {

  if (this.isConsumed()) {

    throw new InvalidGrantError(

      "Authorization Code has already been consumed.",

    );

  }

  if (this.hasExpired()) {

    throw new InvalidGrantError(

      "Authorization Code has expired.",

    );

  }

  this.consumedAt =
    new Date();

}

  /**
   * Returns when the code
   * was consumed.
   */
  consumed(): Date | null {

    return this.consumedAt;

  }

}