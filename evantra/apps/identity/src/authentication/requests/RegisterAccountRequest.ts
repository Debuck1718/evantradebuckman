/**
 * Request body for
 * account registration.
 */
export interface RegisterAccountRequest {
  readonly firstName: string;

  readonly lastName: string;

  /**
   * User-provided local portion.
   *
   * Example:
   * evans1
   *
   * The domain layer converts this to:
   * evans1@evantra
   */
  readonly evantraId: string;

  readonly contactEmail: string;

  readonly password: string;

  /**
   * Optional same-origin path the user
   * is returned to after verifying
   * their contact email.
   *
   * Used by OAuth clients to resume
   * their authorization round-trip.
   */
  readonly returnTo?: string;
}