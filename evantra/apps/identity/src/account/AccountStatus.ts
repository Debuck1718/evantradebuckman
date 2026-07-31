/**
 * Represents the lifecycle of an
 * registered Evantra Account.
 *
 * The status determines whether
 * an account can authenticate
 * and access Evantra services.
 */
export enum AccountStatus {
  /**
   * Account has been created
   * but the contact email has
   * not yet been verified.
   */
  PENDING_VERIFICATION = "PENDING_VERIFICATION",

  /**
   * Account is fully active and
   * can authenticate normally.
   */
  ACTIVE = "ACTIVE",

  /**
   * Account has been temporarily
   * suspended by Evantra or an
   * administrator.
   */
  SUSPENDED = "SUSPENDED",

  /**
   * Account has been disabled
   * by the owner.
   */
  DISABLED = "DISABLED",

  /**
   * Account has been permanently
   * deleted.
   *
   * This status exists primarily
   * for audit and recovery flows.
   */
  DELETED = "DELETED",
}