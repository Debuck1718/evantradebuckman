import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  ChangePasswordWorkflow,
} from "../../workflows";

import {
  ChangePasswordRequest,
} from "../requests";

import {
  ChangePasswordRequestValidator,
} from "../validation";

import {
  ChangePasswordResponseMapper,
} from "../responses";

/**
 * Handles authenticated
 * password changes.
 */
export class ChangePasswordController
implements HttpController {

  constructor(

    private readonly change:
      ChangePasswordWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<
        ChangePasswordRequest
      >,
  ): Promise<HttpResponse> {

    ChangePasswordRequestValidator
      .validate(

        request.body,

      );

    await this.change.execute({

      sessionId:

        request.body.sessionId,

      currentPassword:

        request.body.currentPassword,

      newPassword:

        request.body.newPassword,

    });

    return ChangePasswordResponseMapper
      .success();

  }

}