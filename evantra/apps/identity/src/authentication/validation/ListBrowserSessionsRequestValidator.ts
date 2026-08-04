import {
  HttpError,
  HttpStatus,
} from "../../http";

import {
  ListBrowserSessionsRequest,
} from "../requests";

/**
 * Validates List Browser
 * Session requests.
 */
export class ListBrowserSessionsRequestValidator {

  static validate(
    request: ListBrowserSessionsRequest,
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