import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  RequestContactEmailChangeWorkflow,
} from "../../workflows";

import {
  RequestContactEmailChangeRequest,
} from "../requests";

import {
  RequestContactEmailChangeValidator,
} from "../validation";

import {
  RequestContactEmailChangeResponseMapper,
} from "../responses";

/**
 * Starts a contact email
 * change request.
 */
export class RequestContactEmailChangeController
implements HttpController {

  constructor(

    private readonly workflow:
      RequestContactEmailChangeWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<
        RequestContactEmailChangeRequest
      >,
  ): Promise<HttpResponse> {

    RequestContactEmailChangeValidator
      .validate(

        request.body,

      );

    await this.workflow.execute({

      sessionId:

        request.body.sessionId,

      currentPassword:

        request.body.currentPassword,

      newContactEmail:

        request.body.newContactEmail,

    });

    return RequestContactEmailChangeResponseMapper
      .accepted();

  }

}