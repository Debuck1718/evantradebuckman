/**
 * Completes a password
 * recovery request.
 */
export interface ResetPasswordRequest {

  /**
   * Recovery token.
   */
  token: string;

  /**
   * New password.
   */
  password: string;

}