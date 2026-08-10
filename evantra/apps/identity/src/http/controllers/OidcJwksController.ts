import {
  NextFunction,
  Request,
  Response,
} from "express";

/**
 * OpenID Connect JWKS endpoint.
 */
export class OidcJwksController {
  async handle(
    _request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      response.status(200).json({
        keys: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
