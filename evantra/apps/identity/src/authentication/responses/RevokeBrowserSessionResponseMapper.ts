import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Browser Session
 * revocation responses.
 */
export class RevokeBrowserSessionResponseMapper {

  static success(): HttpResponse {

    return {

      status:

        HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        revoked: true,

      },

    };

  }

}