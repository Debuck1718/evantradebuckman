import {
  HttpCookie,
} from "./HttpCookie";

/**
 * Represents an outgoing
 * HTTP response.
 *
 * Framework-independent.
 */
export interface HttpResponse<Body = unknown> {

  /**
   * HTTP status.
   */
  readonly status: number;

  /**
   * Response headers.
   */
  readonly headers:
    Record<string, string>;

  /**
   * Cookies.
   */
  readonly cookies:
    HttpCookie[];

  /**
   * Response body.
   */
  readonly body: Body;

}