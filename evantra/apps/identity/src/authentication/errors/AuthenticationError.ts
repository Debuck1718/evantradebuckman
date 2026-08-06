import {
  HttpStatus,
} from "../../http";

export abstract class AuthenticationError
  extends Error {

  abstract readonly code: string;

  readonly status =
    HttpStatus.UNAUTHORIZED;

  constructor(
    message: string,
  ) {

    super(message);

    this.name =
      this.constructor.name;

  }

}