import { DomainError } from "./DomainError";

/**
 * Base exception for OAuth
 * protocol errors.
 *
 * RFC6749
 */
export abstract class OAuthError
  extends DomainError {

  protected constructor(

    message: string,

    /**
     * OAuth error code.
     */
    public readonly error: string,

    /**
     * HTTP status.
     */
    public readonly status: number,

  ) {

    super(message);

  }

}