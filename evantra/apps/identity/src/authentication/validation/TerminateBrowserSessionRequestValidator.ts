import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  TerminateBrowserSessionRequest,
} from "../requests";

export class TerminateBrowserSessionRequestValidator {

  static validate(
    request: TerminateBrowserSessionRequest,
  ): void {

    if (!request.sessionId?.trim()) {

      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Session ID is required.",
      );

    }

  }

}