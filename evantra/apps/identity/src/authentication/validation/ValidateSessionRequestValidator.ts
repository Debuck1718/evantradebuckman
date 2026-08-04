import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  ValidateSessionRequest,
} from "../requests";

/**
 * Validates Session
 * validation requests.
 */
export class ValidateSessionRequestValidator {

  /**
   * Validates the request.
   */
  static validate(
    request: ValidateSessionRequest,
  ): void {

    if (

      !request.sessionId?.trim()

    ) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Session ID is required.",

      );

    }

  }

}