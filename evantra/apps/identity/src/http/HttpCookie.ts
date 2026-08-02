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
   * Expiration.
   */
  readonly expiresAt?: Date;

}