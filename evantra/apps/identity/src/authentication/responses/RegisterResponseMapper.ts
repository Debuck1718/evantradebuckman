import {
  Account,
} from "../../account";

import {
  HttpResponse,
  HttpStatus,
} from "../../http";

/**
 * Maps successful account
 * registration responses.
 */
export class RegisterResponseMapper {

  static success(
    account: Account,
  ): HttpResponse {

    return {

      status:
        HttpStatus.CREATED,

      headers: {},

      cookies: [],

      body: {

        account: {

          id:
            account.id,

          evantraId:
            account.evantraId.value(),

          contactEmail:
            account.contactEmail.value(),

          active:
            account.isActive(),

        },

      },

    };

  }

}