import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  VerifyContactEmailChangeRequest,
} from "../requests";

/**
 * Validates a contact
 * email verification request.
 */
export class VerifyContactEmailChangeValidator {

  static validate(
    request: VerifyContactEmailChangeRequest,
  ): void {

    if (

      !request.token?.trim()

    ) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Verification token is required.",

      );

    }

  }

}