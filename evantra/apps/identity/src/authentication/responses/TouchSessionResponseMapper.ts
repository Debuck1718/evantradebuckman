import {
  BrowserSession,
} from "../../session";

import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Browser Session
 * touch responses.
 */
export class TouchSessionResponseMapper {

  static success(
    session: BrowserSession,
  ): HttpResponse {

    return {

      status:

        HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        touched: true,

        session: {

          sessionId:
            session.identity.sessionId,

          accountId:
            session.identity.accountId,

          evantraId:
            session.identity.evantraId.value(),

          expiresAt:
            // use public accessors on lifecycle
            session.lifecycle.getExpiresAt(),

          idleTimeoutAt:
            session.lifecycle.getIdleTimeoutAt(),

        },

      },

    };

  }

}