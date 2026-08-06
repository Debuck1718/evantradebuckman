/**
 * Starts password recovery
 * using the account's
 * contact email.
 */
export interface ForgotPasswordRequest {

  /**
   * Contact email belonging
   * to an Evantra Account.
   */
  contactEmail: string;

}