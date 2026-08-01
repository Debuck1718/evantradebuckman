import { TokenResponse } from "../../../oauth";

/**
 * Serializes an OAuth
 * Token Response.
 */
export class TokenResponseSerializer {

  static serialize(
    response: TokenResponse,
  ) {

    return {

      access_token:
        response.accessToken,

      token_type:
        response.tokenType,

      expires_in:
        response.expiresIn,

      ...(response.refreshToken
        ? {

            refresh_token:
              response.refreshToken,

          }
        : {}),

      ...(response.scope
        ? {

            scope:
              response.scope,

          }
        : {}),

    };

  }

}