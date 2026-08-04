import {
  BrowserSession,
} from "../../session";

import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps Browser Sessions
 * into HTTP responses.
 */
export class ListBrowserSessionsResponseMapper {

  static success(
    sessions: BrowserSession[],
  ): HttpResponse {

    return {

      status:

        HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        sessions:

          sessions.map(

            session => ({

              sessionId:

                session.identity.sessionId,

              accountId:

                session.identity.accountId,

              evantraId:

                session.identity
                  .evantraId
                  .value(),

              authenticated:

                session.authentication
                  .authenticatedAt,

              trusted:

                session.device
                  .isTrusted(),

              locked:

                session.security
                  .isLocked(),

              expiresAt:

                session.lifecycle
                  .getExpiresAt,

              idleTimeoutAt:

                session.lifecycle
                  .getIdleTimeoutAt,

            }),

          ),

      },

    };

  }

}