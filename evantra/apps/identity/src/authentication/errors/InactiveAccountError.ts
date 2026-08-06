import { HttpStatus } from "../../http";
import {
  AuthenticationError,
} from "./AuthenticationError";

export class InactiveAccountError
  extends AuthenticationError {

  readonly code =
    "inactive_account";

  readonly status =
    HttpStatus.UNAUTHORIZED;
  error: any;
  description: any;

  constructor() {

    super(
      "Account is not active.",
    );

  }

}