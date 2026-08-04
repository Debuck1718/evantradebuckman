import {
  HttpResponse,
  HttpStatus,
} from "../../http";

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

      cookies: [],

      body: {

        success: true,

      },

    };

  }

}