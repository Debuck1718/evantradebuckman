import {
  AuthenticationError,
} from "./AuthenticationError";

/**
 * Thrown when an account
 * has not been activated.
 */
export class InactiveAccountError
  extends AuthenticationError {

  constructor() {

    super(
      "Account is not active.",
    );

  }

}