import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  ChangePasswordRequest,
} from "../requests";

/**
 * Validates Change Password
 * requests.
 */
export class ChangePasswordRequestValidator {

  static validate(
    request: ChangePasswordRequest,
  ): void {

    if (!request.sessionId?.trim()) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Session ID is required.",

      );

    }

    if (!request.currentPassword) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Current password is required.",

      );

    }

    if (!request.newPassword) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "New password is required.",

      );

    }

    if (request.newPassword.length < 8) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Password must contain at least 8 characters.",

      );

    }

    if (

      request.currentPassword ===
      request.newPassword

    ) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "New password must be different from the current password.",

      );

    }

  }

}