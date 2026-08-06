import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  ResendVerificationWorkflow,
} from "../../workflows";

import {
  ResendVerificationRequest,
} from "../requests";

import {
  ResendVerificationRequestValidator,
} from "../validation";

import {
  ResendVerificationResponseMapper,
} from "../responses";

/**
 * Sends a new account
 * verification email.
 */
export class ResendVerificationController
implements HttpController {

  constructor(

    private readonly resend:
      ResendVerificationWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<
        ResendVerificationRequest
      >,
  ): Promise<HttpResponse> {

    ResendVerificationRequestValidator
      .validate(

        request.body,

      );

    await this.resend.execute({

      contactEmail:

        request.body.contactEmail,

    });

    return ResendVerificationResponseMapper
      .accepted();

  }

}