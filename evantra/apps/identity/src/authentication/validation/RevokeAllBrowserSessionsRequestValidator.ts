import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  RevokeAllBrowserSessionsRequest,
} from "../requests";

/**
 * Validates Revoke All
 * Browser Session requests.
 */
export class RevokeAllBrowserSessionsRequestValidator {

  static validate(
    request: RevokeAllBrowserSessionsRequest,
  ): void {

    if (

      !request.evantraId?.trim()

    ) {

      throw new HttpError(

        HttpStatus.BAD_REQUEST,

        "Evantra ID is required.",

      );

    }

  }

}