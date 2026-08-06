import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Change Password
 * responses.
 */
export class ChangePasswordResponseMapper {

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