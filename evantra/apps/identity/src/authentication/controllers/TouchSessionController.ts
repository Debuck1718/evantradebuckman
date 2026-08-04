import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  TouchBrowserSessionWorkflow,
} from "../../workflows";

import {
  Clock,
} from "../../platform/Clock";

import {
  TouchSessionRequest,
} from "../requests";

import {
  TouchSessionRequestValidator,
} from "../validation";

import {
  TouchSessionResponseMapper,
} from "../responses";

/**
 * Handles Browser
 * Session activity.
 */
export class TouchSessionController
  implements HttpController {

  constructor(

  private readonly touch:
    TouchBrowserSessionWorkflow,

) {}

  async handle(
    request:
      HttpRequest<
        TouchSessionRequest
      >,
  ): Promise<HttpResponse> {

    TouchSessionRequestValidator.validate(

      request.body,

    );

    const session =
      await this.touch.execute({

        sessionId:

          request.body.sessionId,

      });

    return TouchSessionResponseMapper.success(

      session,

    );

  }

}