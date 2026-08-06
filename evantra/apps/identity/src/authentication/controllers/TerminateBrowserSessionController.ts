import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  TerminateBrowserSessionWorkflow,
} from "../../workflows";

import {
  TerminateBrowserSessionRequest,
} from "../requests";

import {
  TerminateBrowserSessionRequestValidator,
} from "../validation";

import {
  TerminateBrowserSessionResponseMapper,
} from "../responses";

/**
 * Terminates a Browser Session.
 */
export class TerminateBrowserSessionController
  implements HttpController {

  constructor(
    private readonly terminate:
      TerminateBrowserSessionWorkflow,
  ) {}

  async handle(
    request:
      HttpRequest<
        TerminateBrowserSessionRequest
      >,
  ): Promise<HttpResponse> {

    TerminateBrowserSessionRequestValidator.validate(
      request.body,
    );

    await this.terminate.execute({
      sessionId:
        request.body.sessionId,
    });

    return TerminateBrowserSessionResponseMapper.success();
  }
}