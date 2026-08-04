import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  EvantraId,
} from "../../account";

import {
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
 * an Evantra Account.
 */
export class ListBrowserSessionsController
  implements HttpController {

  constructor(

    private readonly list:
      ListBrowserSessionsWorkflow,

  ) {}

  async handle(
    request:
      HttpRequest<
        ListBrowserSessionsRequest
      >,
  ): Promise<HttpResponse> {

    ListBrowserSessionsRequestValidator
      .validate(

        request.body,

      );

    const sessions =
      await this.list.execute({

        evantraId:

         EvantraId.from(

    request.body.evantraId,

),

      });

    return ListBrowserSessionsResponseMapper
      .success(

        sessions,

      );

  }

}