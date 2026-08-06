/**
 * Revokes every Browser Session
 * belonging to an Evantra Account.
 */
export interface RevokeAllBrowserSessionsRequest {

  /**
   * Evantra ID.
   */
  evantraId: string;

  /**
   * Optional Browser Session
   * to keep active.
   */
  exceptSessionId?: string;

}