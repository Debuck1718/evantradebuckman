import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  TerminateBrowserSessionWorkflow,
} from "../../workflows";

import {
  LogoutRequest,
} from "../requests";

import {
  LogoutRequestValidator,
} from "../validation";

import {
  LogoutResponseMapper,
} from "../responses";

/**
 * Handles logout requests.
 *
 * Terminates the current
 * Browser Session.
 */
export class LogoutController
  implements HttpController {

  constructor(

    private readonly terminate:
      TerminateBrowserSessionWorkflow,

  ) {}

  /**
   * Terminates a Browser
   * Session.
   */
  async handle(
    request: HttpRequest<LogoutRequest>,
  ): Promise<HttpResponse> {

    LogoutRequestValidator.validate(

      request.body,

    );

    await this.terminate.execute({

      sessionId:

        request.body.sessionId,

    });

    return LogoutResponseMapper.success();

  }

}