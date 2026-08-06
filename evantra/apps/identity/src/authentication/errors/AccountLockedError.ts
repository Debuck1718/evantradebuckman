/**
 * Thrown when an account
 * is temporarily locked
 * because of too many
 * failed login attempts.
 */
export class AccountLockedError
  extends Error {

  constructor() {

    super(

      "Account is temporarily locked.",

    );

    this.name =
      "AccountLockedError";

  }

}