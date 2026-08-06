import {
  BrowserSession,
} from "../../session";

import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Rotate Browser
 * Session responses.
 */
export class RotateBrowserSessionResponseMapper {

  static success(
    session: BrowserSession,
  ): HttpResponse {

    return {

      status:
        HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        rotated: true,

        session: {

          sessionId:
            session.identity.sessionId,

          accountId:
            session.identity.accountId,

          evantraId:
            session.identity
              .evantraId
              .value(),

          expiresAt:
            session.lifecycle
              .getExpiresAt(),

          idleTimeoutAt:
            session.lifecycle
              .getIdleTimeoutAt(),

        },

      },

    };

  }

}