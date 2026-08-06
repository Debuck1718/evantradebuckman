import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  ForgotPasswordRequest,
} from "../requests";

/**
 * Validates Forgot Password
 * requests.
 */
export class ForgotPasswordRequestValidator {

  static validate(
    request: ForgotPasswordRequest,
  ): void {

    if (

      !request.contactEmail?.trim()

    ) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Contact email is required.",

      );

    }

    const email =
      request.contactEmail.trim();

    if (

      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )

    ) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Contact email is invalid.",

      );

    }

  }

}