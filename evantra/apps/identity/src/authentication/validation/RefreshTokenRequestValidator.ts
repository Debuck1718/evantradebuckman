import {
  RefreshTokenRequest,
} from "../requests";

/**
 * Validates a refresh
 * token request.
 */
export class RefreshTokenRequestValidator {

  static validate(
    request: RefreshTokenRequest,
  ): void {

    if (

      !request.refreshToken ||

      !request.refreshToken.trim()

    ) {

      throw new Error(

        "Refresh token is required.",

      );

    }

  }

}