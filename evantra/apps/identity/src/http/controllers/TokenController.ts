import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  TokenGrantDispatcher,
} from "../oauth/grants/TokenGrantDispatcher";

import {
  TokenRequest,
} from "../oauth/TokenRequest";

import {
  TokenResponseSerializer,
} from "../oauth/serializers/TokenResponseSerializer";

import {
  validateTokenRequest,
} from "../oauth/validation/validateTokenRequest";

/**
 * OAuth Token Endpoint.
 *
 * POST /oauth/token
 */
export class TokenController {

  constructor(
    private readonly dispatcher:
      TokenGrantDispatcher,
  ) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {

    try {

      const tokenRequest =
        validateTokenRequest(
          request.body as TokenRequest,
        );

      const tokenResponse =
        await this.dispatcher.dispatch(
          tokenRequest,
        );

      response
        .status(200)
        .json(
          TokenResponseSerializer.serialize(
            tokenResponse,
          ),
        );

    } catch (error) {

      next(error);

    }
  }
}