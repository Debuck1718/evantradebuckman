import {
  HttpController,
  HttpError,
  HttpRequest,
  HttpResponse,
  HttpStatus,
} from "../../http";

import {
  ValidateIdentitySessionWorkflow,
} from "../../workflows";

import {
  ValidateSessionRequest,
} from "../requests";

import {
  ValidateSessionResponseMapper,
} from "../responses";

/**
 * Handles Browser
 * Session validation.
 */
export class ValidateSessionController
  implements HttpController {

  constructor(

    private readonly validate:
      ValidateIdentitySessionWorkflow,

  ) {}

  /**
   * Validates the current
   * Browser Session.
   */
  async handle(
    request:
      HttpRequest<
        ValidateSessionRequest
      >,
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

    const identitySession =
      await this.validate.execute({

        sessionId:

          sessionId,

      });

    return ValidateSessionResponseMapper
      .success(

        identitySession,

      );

  }

}