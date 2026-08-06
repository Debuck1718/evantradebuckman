import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Resend Verification
 * responses.
 */
export class ResendVerificationResponseMapper {

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