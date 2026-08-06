import {
  HttpStatus,
} from "../../http";

import {
  AuthenticationError,
} from "./AuthenticationError";

/**
 * Thrown when an account
 * is temporarily locked
 * because of too many
 * failed login attempts.
 */
export class AccountLockedError
  extends AuthenticationError {

  readonly code =
    "account_locked";

  readonly status =
    HttpStatus.UNAUTHORIZED;
  error: any;
  description: any;

  constructor() {

    super(
      "Account is temporarily locked.",
    );

  }

}