import { OAuthError } from "./OAuthError";

/**
 * The request is missing a
 * required parameter or is malformed.
 */
export class InvalidRequestError
  extends OAuthError {

  constructor(
    description: string,
  ) {

    super(

      "invalid_request",

      description,

    );

  }

}