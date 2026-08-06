import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  VerifyContactEmailChangeWorkflow,
} from "../../workflows";

import {
  VerifyContactEmailChangeRequest,
} from "../requests";

import {
  VerifyContactEmailChangeValidator,
} from "../validation";

import {
  VerifyContactEmailChangeResponseMapper,
} from "../responses";

/**
 * Verifies a pending
 * contact email change.
 */
export class VerifyContactEmailChangeController
  implements HttpController {

  constructor(

    private readonly verify:
      VerifyContactEmailChangeWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<
        VerifyContactEmailChangeRequest
      >,
  ): Promise<HttpResponse> {

    VerifyContactEmailChangeValidator
      .validate(

        request.body,

      );

    await this.verify.execute({

      token:

        request.body.token,

    });

    return VerifyContactEmailChangeResponseMapper
      .success();

  }

}