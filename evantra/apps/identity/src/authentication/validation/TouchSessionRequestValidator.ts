import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  TouchSessionRequest,
} from "../requests";

/**
 * Validates Touch Session
 * requests.
 */
export class TouchSessionRequestValidator {

  static validate(
    request: TouchSessionRequest,
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