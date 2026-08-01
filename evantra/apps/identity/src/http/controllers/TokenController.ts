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

/**
 * OAuth Token Endpoint.
 */
export class TokenController {

  constructor(

    private readonly dispatcher:
      TokenGrantDispatcher,

  ) {}

  /**
   * Handles POST /oauth/token.
   */
  async handle(

    request: Request,

    response: Response,

    next: NextFunction,

  ): Promise<void> {

    try {

      const tokenResponse =
        await this.dispatcher.dispatch(

          request.body as TokenRequest,

        );

      response.json(

        TokenResponseSerializer.serialize(

          tokenResponse,

        ),

      );

    }

    catch (error) {

      next(error);

    }

  }

}