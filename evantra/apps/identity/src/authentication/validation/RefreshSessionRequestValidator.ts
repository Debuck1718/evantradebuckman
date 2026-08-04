import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  RefreshSessionRequest,
} from "../requests";

/**
 * Validates Refresh
 * Session requests.
 */
export class RefreshSessionRequestValidator {

  /**
   * Validates the request.
   */
  static validate(
    request: RefreshSessionRequest,
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