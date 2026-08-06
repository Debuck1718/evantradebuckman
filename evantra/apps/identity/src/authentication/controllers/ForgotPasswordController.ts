import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  ForgotPasswordWorkflow,
} from "../../workflows";

import {
  ForgotPasswordRequest,
} from "../requests";

import {
  ForgotPasswordRequestValidator,
} from "../validation";

import {
  ForgotPasswordResponseMapper,
} from "../responses";

/**
 * Handles password
 * recovery requests.
 */
export class ForgotPasswordController
implements HttpController {

  constructor(

    private readonly forgot:
      ForgotPasswordWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<
        ForgotPasswordRequest
      >,
  ): Promise<HttpResponse> {

    ForgotPasswordRequestValidator
      .validate(

        request.body,

      );

    await this.forgot.execute({

      contactEmail:

        request.body.contactEmail,

    });

    return ForgotPasswordResponseMapper
      .success();

  }

}