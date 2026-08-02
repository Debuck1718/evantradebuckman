/**
 * Request body for
 * account authentication.
 */
export interface AuthenticateRequest {

  /**
   * Evantra Identity.
   */
  readonly evantraId: string;

  /**
   * Account password.
   */
  readonly password: string;

  /**
   * Remember this browser.
   */
  readonly rememberMe?: boolean;

}