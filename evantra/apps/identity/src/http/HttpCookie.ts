/**
 * Represents an HTTP cookie.
 */
export interface HttpCookie {

  /**
   * Cookie name.
   */
  readonly name: string;

  /**
   * Cookie value.
   */
  readonly value: string;

  /**
   * HTTP Only.
   */
  readonly httpOnly: boolean;

  /**
   * Secure.
   */
  readonly secure: boolean;

  /**
   * SameSite.
   */
  readonly sameSite:
    "strict"
    | "lax"
    | "none";

  /**
   * Cookie path.
   */
  readonly path: string;

  /**
   * Optional cookie domain.
   *
   * When Evantra Identity is reached
   * through a first-party proxy such as
   * identity.evantradebuckman.com, the
   * browser must be told the cookie
   * belongs to that host. Leaving the
   * domain unset produces a host-only
   * cookie bound to the upstream host,
   * which the browser then refuses to
   * replay, stranding the visitor on a
   * stale session identifier.
   */
  readonly domain?: string;

  /**
   * Expiration.
   */
  readonly expiresAt?: Date;

}