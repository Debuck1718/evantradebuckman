import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  ValidateBrowserSessionWorkflow,
} from "../../workflows";

import {
  ValidateSessionRequest,
} from "../requests";

import {
  ValidateSessionRequestValidator,
} from "../validation";

import {
  ValidateSessionResponseMapper,
} from "../responses";

/**
 * Handles Browser
 * Session validation.
 */
export class ValidateSessionController
  implements HttpController {

  constructor(

    private readonly validate:
      ValidateBrowserSessionWorkflow,

  ) {}

  /**
   * Validates the current
   * Browser Session.
   */
  async handle(
    request:
      HttpRequest<
        ValidateSessionRequest
      >,
  ): Promise<HttpResponse> {

    ValidateSessionRequestValidator
      .validate(

        request.body,

      );

    const session =
      await this.validate.execute({

        sessionId:

          request.body.sessionId,

      });

    return ValidateSessionResponseMapper
      .success(

        session,

      );

  }

}