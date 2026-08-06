import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  RotateBrowserSessionWorkflow,
} from "../../workflows";

import {
  RotateBrowserSessionRequest,
} from "../requests";

import {
  RotateBrowserSessionRequestValidator,
} from "../validation";

import {
  RotateBrowserSessionResponseMapper,
} from "../responses";

/**
 * Rotates a Browser Session.
 */
export class RotateBrowserSessionController
  implements HttpController {

  constructor(

    private readonly rotate:
      RotateBrowserSessionWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<
        RotateBrowserSessionRequest
      >,
  ): Promise<HttpResponse> {

    RotateBrowserSessionRequestValidator
      .validate(

        request.body,

      );

    const session =
      await this.rotate.execute({

        currentSessionId:

          request.body.currentSessionId,

      });

    return RotateBrowserSessionResponseMapper
      .success(

        session,

      );

  }

}