import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  LogoutRequest,
} from "../requests";

/**
 * Validates Logout requests.
 */
export class LogoutRequestValidator {

  /**
   * Validates the request.
   */
  static validate(
    request: LogoutRequest,
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