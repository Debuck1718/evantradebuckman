/**
 * Represents an incoming
 * HTTP request.
 *
 * This abstraction isolates
 * the application layer from
 * any web framework.
 */
export interface HttpRequest<Body = unknown> {

  /**
   * Route parameters.
   */
  readonly params:
    Record<string, string>;

  /**
   * Query string.
   */
  readonly query:
    Record<string, string>;

  /**
   * Request headers.
   */
  readonly headers:
    Record<string, string>;

  /**
   * Cookies.
   */
  readonly cookies:
    Record<string, string>;

  /**
   * Request body.
   */
  readonly body:
    Body;

  /**
   * Client IP address.
   */
  readonly ipAddress: string;

}