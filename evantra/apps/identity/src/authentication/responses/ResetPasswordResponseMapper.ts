import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Reset Password
 * responses.
 */
export class ResetPasswordResponseMapper {

  static success(): HttpResponse {

    return {

      status: HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        success: true,

      },

    };

  }

}