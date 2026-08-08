import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  VerifyAccountWorkflow,
} from "../../workflows";

import {
  VerifyAccountRequest,
} from "../requests";

import {
  VerifyAccountRequestValidator,
} from "../validation";

import {
  VerificationResponseMapper,
} from "../responses";

/**
 * Handles account verification.
 */
export class VerifyAccountController
  implements HttpController
{
  constructor(
    private readonly verify:
      VerifyAccountWorkflow,
  ) {}

  async handle(
    request: HttpRequest<VerifyAccountRequest>,
  ): Promise<HttpResponse> {

    VerifyAccountRequestValidator.validate(
      request.body,
    );

    await this.verify.execute(
      request.body.token,
    );

    return VerificationResponseMapper.success();
  }
}