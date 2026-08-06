import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  ValidateBrowserSessionWorkflow,
  ListBrowserSessionsWorkflow,
} from "../../workflows";

import {
  ListBrowserSessionsRequest,
} from "../requests";

import {
  ListBrowserSessionsRequestValidator,
} from "../validation";

import {
  ListBrowserSessionsResponseMapper,
} from "../responses";

/**
 * Returns every Browser
 * Session belonging to
 * the authenticated Account.
 */
export class ListBrowserSessionsController
  implements HttpController {

  constructor(

    private readonly validateSession:
      ValidateBrowserSessionWorkflow,

    private readonly list:
      ListBrowserSessionsWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<ListBrowserSessionsRequest>,
  ): Promise<HttpResponse> {

    ListBrowserSessionsRequestValidator
      .validate(
        request.body,
      );

    // ======================================================
    // Validate the current Browser Session
    // ======================================================

    const browserSession =
      await this.validateSession.execute({

        sessionId:
          request.body.sessionId,

      });

    // ======================================================
    // List every Browser Session
    // for the authenticated Account
    // ======================================================

    const sessions =
      await this.list.execute({

        accountId:
          browserSession.identity.accountId,

      });

    return ListBrowserSessionsResponseMapper
      .success(
        sessions,
      );

  }

}