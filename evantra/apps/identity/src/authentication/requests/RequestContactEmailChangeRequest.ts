/**
 * Requests a change to the
 * account contact email.
 */
export interface RequestContactEmailChangeRequest {

  /**
   * Current authenticated
   * browser session.
   */
  sessionId: string;

  /**
   * Current password.
   */
  currentPassword: string;

  /**
   * Desired contact email.
   */
  newContactEmail: string;

}