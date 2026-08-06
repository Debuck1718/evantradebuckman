import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Revoke All Browser
 * Session responses.
 */
export class RevokeAllBrowserSessionsResponseMapper {

  static success(result: {

    revoked: number;

    skipped: number;

  }): HttpResponse {

    return {

      status:

        HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        revoked:

          result.revoked,

        skipped:

          result.skipped,

      },

    };

  }

}