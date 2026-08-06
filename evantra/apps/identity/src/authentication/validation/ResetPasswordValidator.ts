import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  ResetPasswordRequest,
} from "../requests";

/**
 * Validates Reset Password
 * requests.
 */
export class ResetPasswordRequestValidator {

  static validate(
    request: ResetPasswordRequest,
  ): void {

    if (!request.token?.trim()) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Recovery token is required.",

      );

    }

    if (!request.password) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Password is required.",

      );

    }

    if (request.password.length < 8) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Password must contain at least 8 characters.",

      );

    }

  }

}