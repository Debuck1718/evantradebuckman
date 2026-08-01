import {
  UnsupportedGrantTypeError,
} from "../../../oauth/errors";

import {
  TokenResponse,
} from "../../../oauth";

import {
  TokenRequest,
} from "../TokenRequest";

import {
  TokenGrantHandler,
} from "./TokenGrantHandler";

/**
 * Dispatches OAuth Token Requests
 * to the appropriate Grant Handler.
 *
 * RFC 6749
 */
export class TokenGrantDispatcher {

  constructor(

    private readonly handlers:
      readonly TokenGrantHandler[],

  ) {}

  /**
   * Dispatches an OAuth
   * Token Request.
   */
  async dispatch(
    request: TokenRequest,
  ): Promise<TokenResponse> {

    const handler =
      this.handlers.find(

        handler =>
          handler.supports(
            request.grant_type,
          ),

      );

    if (!handler) {

      throw new UnsupportedGrantTypeError();

    }

    return handler.execute(
      request,
    );

  }

}