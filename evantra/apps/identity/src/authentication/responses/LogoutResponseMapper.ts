import {
  HttpResponse,
  HttpStatus,
} from "../../http";

import {
  SessionCookieMapper,
} from "./SessionCookieMapper";

/**
 * Maps Logout responses.
 */
export class LogoutResponseMapper {

  /**
   * Successful logout.
   */
  static success(): HttpResponse {

    return {

      status:

        HttpStatus.OK,

      headers: {},

      cookies: [
        SessionCookieMapper.clear(),
      ],

      body: {

        success: true,

      },

    };

  }

}