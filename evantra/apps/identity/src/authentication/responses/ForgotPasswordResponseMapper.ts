import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Forgot Password
 * responses.
 */
export class ForgotPasswordResponseMapper {

  static success(): HttpResponse {

    return {

      status:
        HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        accepted: true,

      },

    };

  }

}