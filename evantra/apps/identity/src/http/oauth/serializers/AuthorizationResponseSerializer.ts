import { AuthorizationResponse } from "../../../authorization";

/**
 * Builds the OAuth redirect
 * URI returned to the client.
 */
export class AuthorizationResponseSerializer {

  static serialize(
    response: AuthorizationResponse,
  ): string {

    const url =
      new URL(
        response.redirectUri,
      );

    url.searchParams.set(
      "code",
      response.code,
    );

    if (response.state) {

      url.searchParams.set(
        "state",
        response.state,
      );

    }

    return url.toString();

  }

}