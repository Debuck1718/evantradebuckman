import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  RevokeBrowserSessionWorkflow,
} from "../../workflows";

import {
  RevokeBrowserSessionRequest,
} from "../requests";

import {
  RevokeBrowserSessionRequestValidator,
} from "../validation";

import {
  RevokeBrowserSessionResponseMapper,
} from "../responses";

/**
 * Revokes a Browser Session.
 */
export class RevokeBrowserSessionController
  implements HttpController {

  constructor(

    private readonly revoke:
      RevokeBrowserSessionWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<
        RevokeBrowserSessionRequest
      >,
  ): Promise<HttpResponse> {

    RevokeBrowserSessionRequestValidator
      .validate(

        request.body,

      );

    await this.revoke.execute({

      sessionId:

        request.body.sessionId,

    });

    return RevokeBrowserSessionResponseMapper
      .success();

  }

}