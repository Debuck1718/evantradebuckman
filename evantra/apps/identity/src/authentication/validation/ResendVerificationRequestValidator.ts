import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  ResendVerificationRequest,
} from "../requests";

/**
 * Validates Resend Verification
 * requests.
 */
export class ResendVerificationRequestValidator {

  static validate(
    request: ResendVerificationRequest,
  ): void {

    if (

      !request.contactEmail?.trim()

    ) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Contact email is required.",

      );

    }

  }

}