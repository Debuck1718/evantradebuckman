/**
 * Base OAuth 2.1 error.
 *
 * RFC 6749
 * Section 5.2
 */
export abstract class OAuthError
  extends Error {

  protected constructor(

    /**
     * OAuth error code.
     */
    public readonly code: string,

    /**
     * Human-readable description.
     */
    message: string,

    /**
     * Optional URI explaining
     * the error.
     */
    public readonly uri?: string,

  ) {

    super(message);

  }

}