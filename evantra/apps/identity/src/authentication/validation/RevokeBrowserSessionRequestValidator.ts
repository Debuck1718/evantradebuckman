import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  RevokeBrowserSessionRequest,
} from "../requests";

/**
 * Validates Revoke Browser
 * Session requests.
 */
export class RevokeBrowserSessionRequestValidator {

  static validate(
    request: RevokeBrowserSessionRequest,
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