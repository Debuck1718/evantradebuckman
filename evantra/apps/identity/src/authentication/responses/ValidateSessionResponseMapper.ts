import {
  HttpResponse,
  HttpStatus,
} from "../../http";

import {
  BrowserSession,
} from "../../session";

import {
  Account,
} from "../../account";

/**
 * Maps validated Browser
 * Sessions into HTTP responses.
 */
export class ValidateSessionResponseMapper {

  /**
   * Successful validation.
   */
  static success(
    identitySession: {
      account: Account;
      session: BrowserSession;
    },
  ): HttpResponse {

    const session =
      identitySession.session;

    const account =
      identitySession.account;

    return {

      status:

        HttpStatus.OK,

      headers: {},

      cookies: [],

      body: {

        authenticated: true,

        account: {

          id:
            account.id,

          firstName:
            account.firstName,

          lastName:
            account.lastName,

          evantraId:
            account.evantraId.value(),

          contactEmail:
            account.contactEmail.value(),

          status:
            account.getStatus(),

        },

        session: {

          id:
            session.identity.sessionId,

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