import {
  HttpRequest,
} from "./HttpRequest";

import {
  HttpResponse,
} from "./HttpResponse";

/**
 * Base contract for every
 * HTTP controller.
 */
export interface HttpController {

  handle(
    request: HttpRequest,
  ): Promise<HttpResponse>;

}