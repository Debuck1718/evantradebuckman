import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps successful account
 * verification responses.
 */
export class VerificationResponseMapper {

  static success(): HttpResponse {

    return {

      status:
        HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        verified: true,

      },

    };

  }

}