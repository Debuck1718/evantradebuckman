import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  EvantraId,
} from "../../account";

import {
  RevokeAllBrowserSessionsWorkflow,
} from "../../workflows";

import {
  RevokeAllBrowserSessionsRequest,
} from "../requests";

import {
  RevokeAllBrowserSessionsRequestValidator,
} from "../validation";

import {
  RevokeAllBrowserSessionsResponseMapper,
} from "../responses";

/**
 * Revokes every Browser
 * Session belonging to
 * an Evantra Account.
 */
export class RevokeAllBrowserSessionsController
  implements HttpController {

  constructor(

    private readonly revoke:
      RevokeAllBrowserSessionsWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<
        RevokeAllBrowserSessionsRequest
      >,
  ): Promise<HttpResponse> {

    RevokeAllBrowserSessionsRequestValidator
      .validate(

        request.body,

      );

    const exceptSessionId = request.body.exceptSessionId;

    const result =
      await this.revoke.execute({

        evantraId:

          EvantraId.from(

            request.body.evantraId,

          ),

        ...(exceptSessionId !== undefined && {
          exceptSessionId,
        }),

      });

    return RevokeAllBrowserSessionsResponseMapper
      .success(

        result,

      );

  }

}