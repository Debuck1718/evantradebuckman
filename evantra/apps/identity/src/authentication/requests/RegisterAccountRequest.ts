/**
 * Request body for
 * account registration.
 */
export interface RegisterAccountRequest {

  readonly evantraId: string;

  readonly contactEmail: string;

  readonly password: string;

}