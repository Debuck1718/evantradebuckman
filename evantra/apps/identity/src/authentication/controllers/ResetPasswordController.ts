import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  ResetPasswordWorkflow,
} from "../../workflows";

import {
  ResetPasswordRequest,
} from "../requests";

import {
  ResetPasswordRequestValidator,
} from "../validation";

import {
  ResetPasswordResponseMapper,
} from "../responses";

/**
 * Completes a password
 * recovery request.
 */
export class ResetPasswordController
implements HttpController {

  constructor(

    private readonly reset:
      ResetPasswordWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<
        ResetPasswordRequest
      >,
  ): Promise<HttpResponse> {

    ResetPasswordRequestValidator
      .validate(

        request.body,

      );

    await this.reset.execute({

      token:

        request.body.token,

      password:

        request.body.password,

    });

    return ResetPasswordResponseMapper
      .success();

  }

}