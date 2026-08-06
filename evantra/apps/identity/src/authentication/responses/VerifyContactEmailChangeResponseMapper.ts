import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Verify Contact Email
 * responses.
 */
export class VerifyContactEmailChangeResponseMapper {

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