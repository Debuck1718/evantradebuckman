import {
  BrowserSession,
} from "../../session";

import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps refreshed Browser
 * Sessions into HTTP
 * responses.
 */
export class RefreshSessionResponseMapper {

  /**
   * Successful refresh.
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

        refreshed: true,

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