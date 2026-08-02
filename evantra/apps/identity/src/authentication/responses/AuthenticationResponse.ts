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

      cookies: [],

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

        },

        session: {

          id:
            params.session.id,

          expiresAt:
            params.session.expiresAt,

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