import {
  HttpResponse,
  HttpStatus,
} from "../../http";

import {
  BrowserSession,
} from "../../session";

/**
 * Maps validated Browser
 * Sessions into HTTP responses.
 */
export class ValidateSessionResponseMapper {

  /**
   * Successful validation.
   */
  static success(
    session: BrowserSession,
  ): HttpResponse {

    return {

      status:

        HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        authenticated: true,

        session: {

          sessionId:
            session.identity.sessionId,

          accountId:
            session.identity.accountId,

          evantraId:
            session.identity.evantraId.value(),

          expiresAt:
            session.lifecycle.getExpiresAt(),

          idleTimeoutAt:
            session.lifecycle.getIdleTimeoutAt(),

        },

      },

    };

  }

}