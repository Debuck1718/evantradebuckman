import {
  EvantraId,
} from "../../account";

import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  AuthenticateWorkflow,
} from "../../workflows";

import {
  AuthenticationContextMapper,
} from "../context";

import {
  AuthenticationResponseMapper,
} from "../responses";

import {
  AuthenticateRequest,
} from "../requests";

import {
  AuthenticateRequestValidator,
} from "../validation";

/**
 * Handles authentication
 * requests.
 *
 * Controllers coordinate the
 * request lifecycle only.
 */
export class AuthenticateController
  implements HttpController {

  constructor(

    private readonly authenticate:
      AuthenticateWorkflow,

  ) {}

  /**
   * Authenticates an
   * Evantra Identity.
   */
  async handle(
    request: HttpRequest<AuthenticateRequest>,
  ): Promise<HttpResponse> {

    // ========================================================
    // Validate Request
    // ========================================================

    AuthenticateRequestValidator
      .validate(
        request.body,
      );

    // ========================================================
    // Authentication Context
    // ========================================================

    const context =
      AuthenticationContextMapper
        .fromRequest(
          request,
        );

    // ========================================================
    // Authenticate
    // ========================================================

    const result =
      await this.authenticate.execute({

        evantraId:
          EvantraId.from(
            request.body.evantraId,
          ),

        password:
          request.body.password,

        context,

      });

    // ========================================================
    // Response
    // ========================================================

    return AuthenticationResponseMapper
      .success(
        result,
      );

  }

}