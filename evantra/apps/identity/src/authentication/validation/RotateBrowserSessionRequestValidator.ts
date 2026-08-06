import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  RotateBrowserSessionRequest,
} from "../requests";

/**
 * Validates Rotate Browser
 * Session requests.
 */
export class RotateBrowserSessionRequestValidator {

  static validate(
    request: RotateBrowserSessionRequest,
  ): void {

    if (

      !request.currentSessionId?.trim()

    ) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Current Session ID is required.",

      );

    }

  }

}