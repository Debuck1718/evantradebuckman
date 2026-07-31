/**
 * Represents the lifecycle
 * of an OAuth Client.
 *
 * A Client represents an
 * application trusted by
 * Evantra Identity.
 */
export enum ClientStatus {

  /**
   * Client has been created
   * but is awaiting approval.
   */
  PENDING_APPROVAL = "PENDING_APPROVAL",

  /**
   * Client may participate
   * in OAuth flows.
   */
  ACTIVE = "ACTIVE",

  /**
   * Client exists but
   * authentication is blocked.
   */
  DISABLED = "DISABLED",

  /**
   * Client has been permanently
   * revoked.
   */
  REVOKED = "REVOKED",

}