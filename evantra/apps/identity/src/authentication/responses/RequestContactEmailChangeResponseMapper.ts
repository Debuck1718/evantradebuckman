import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps responses for
 * contact email change
 * requests.
 */
export class RequestContactEmailChangeResponseMapper {

  static accepted(): HttpResponse {

    return {

      status:

        HttpStatus.ACCEPTED,

      headers: {},

      cookies: [],

      body: {

        accepted: true,

      },

    };

  }

}