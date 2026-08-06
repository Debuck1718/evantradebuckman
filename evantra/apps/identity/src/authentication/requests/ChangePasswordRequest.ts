/**
 * Requests a password change
 * for an authenticated account.
 */
export interface ChangePasswordRequest {

  /**
   * Active Browser Session.
   */
  sessionId: string;

  /**
   * Existing password.
   */
  currentPassword: string;

  /**
   * Replacement password.
   */
  newPassword: string;

}