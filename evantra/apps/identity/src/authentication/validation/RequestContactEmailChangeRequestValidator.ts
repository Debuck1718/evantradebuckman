import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  RequestContactEmailChangeRequest,
} from "../requests";

/**
 * Validates a contact
 * email change request.
 */
export class RequestContactEmailChangeValidator {

  static validate(
    request: RequestContactEmailChangeRequest,
  ): void {

    if (!request.sessionId?.trim()) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Session ID is required.",

      );

    }

    if (!request.currentPassword?.trim()) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Current password is required.",

      );

    }

    if (!request.newContactEmail?.trim()) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "New contact email is required.",

      );

    }

  }

}