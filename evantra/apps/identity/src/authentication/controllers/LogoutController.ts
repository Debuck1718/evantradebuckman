import {
  HttpController,
  HttpError,
  HttpRequest,
  HttpResponse,
  HttpStatus,
} from "../../http";

import {
  TerminateBrowserSessionWorkflow,
} from "../../workflows";

import {
  LogoutRequest,
} from "../requests";

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

    const sessionIdCandidates = [
      request.body?.sessionId,
      request.cookies.evantra_session_id,
      request.cookies.session_id,
      request.headers["x-session-id"],
    ];

    const sessionId =
      sessionIdCandidates
        .map((value) =>
          typeof value === "string"
            ? value.trim()
            : "",
        )
        .find((value) => Boolean(value));

    if (!sessionId) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Session ID is required.",
      );
    }

    await this.terminate.execute({

      sessionId:

        sessionId,

    });

    return LogoutResponseMapper.success();

  }

}