import {
  AuthenticationError,
} from "./AuthenticationError";

export class InvalidCredentialsError
  extends AuthenticationError {

  readonly code =
    "invalid_credentials";
  error: any;
  description: any;

  constructor() {

    super(
      "Invalid credentials.",
    );

  }

}