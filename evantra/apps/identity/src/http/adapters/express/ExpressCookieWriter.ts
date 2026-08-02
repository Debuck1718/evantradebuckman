import {

  Response,

} from "express";

import {

  HttpCookie,

} from "../../";

/**
 * Writes HttpCookies
 * to Express.
 */
export class ExpressCookieWriter {

  static write(

    response: Response,

    cookies: readonly HttpCookie[],

  ): void {

    for (

      const cookie of cookies

    ) {

      response.cookie(

        cookie.name,

        cookie.value,

        {

          httpOnly:

            cookie.httpOnly,

          secure:

            cookie.secure,

          sameSite:

            cookie.sameSite,

          path:

            cookie.path,

          expires:

            cookie.expiresAt,

        },

      );

    }

  }

}