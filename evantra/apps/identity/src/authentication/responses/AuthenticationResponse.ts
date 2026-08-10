import {
  Account,
} from "../../account";

import {
  BrowserSession,
  Session,
} from "../../session";

import {
  HttpResponse,
  HttpStatus,
} from "../../http";

import {
  SessionCookieMapper,
} from "./SessionCookieMapper";

/**
 * Maps authentication
 * results into HTTP
 * responses.
 */
export class AuthenticationResponseMapper {

  /**
   * Successful authentication.
   */
  static success(params: {

    account: Account;

    session: Session;

    browserSession: BrowserSession;

  }): HttpResponse {

    return {

      status:
        HttpStatus.OK,

      headers: {},

      cookies: [
        SessionCookieMapper.active(
          params.browserSession,
        ),
      ],

      body: {

        account: {

          id:
            params.account.id,

          evantraId:
            params.account
              .evantraId
              .value(),

          contactEmail:
            params.account
              .contactEmail
              .value(),

          firstName:
            params.account.firstName,

          lastName:
            params.account.lastName,

          status:
            params.account.getStatus(),

        },

        session: {

          id:
            params.session.id,

          sessionId:
            params.browserSession
              .identity
              .sessionId,

          accountId:
            params.browserSession
              .identity
              .accountId,

          evantraId:
            params.browserSession
              .identity
              .evantraId
              .value(),

          expiresAt:
            params.session.expiresAt,

          idleTimeoutAt:
            params.browserSession
              .lifecycle
              .getIdleTimeoutAt(),

        },

        browserSession: {

          sessionId:
            params.browserSession
              .identity
              .sessionId,

        },

      },

    };

  }

}