import {
  HttpError,
  HttpStatus,
} from "../../http";

/**
 * Base authentication error.
 *
 * Represents an authentication
 * failure returned to clients.
 */
export class AuthenticationError
  extends HttpError {

  constructor(
    message = "Authentication failed.",
    status = HttpStatus.UNAUTHORIZED,
  ) {

    super(
      status,
      message,
    );

  }

}