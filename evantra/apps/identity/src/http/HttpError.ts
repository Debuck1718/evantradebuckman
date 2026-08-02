import {
  HttpStatus,
} from "./HttpStatus";

/**
 * Represents an HTTP error.
 *
 * Domain exceptions are converted
 * into this abstraction before
 * leaving the application layer.
 */
export class HttpError extends Error {

  constructor(

    public readonly status: HttpStatus,

    message: string,

  ) {

    super(message);

    Object.setPrototypeOf(

      this,

      HttpError.prototype,

    );

  }

}