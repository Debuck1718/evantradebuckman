import {
  AuthenticationError,
} from "./AuthenticationError";

/**
 * Thrown when supplied
 * credentials are invalid.
 */
export class InvalidCredentialsError
  extends AuthenticationError {

  constructor() {

    super(
      "Invalid credentials.",
    );

  }

}