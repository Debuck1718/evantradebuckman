import { OAuthError } from "./OAuthError";

/**
 * Authorization Grant is invalid.
 */
export class InvalidGrantError
  extends OAuthError {

  constructor(
    description: string,
  ) {

    super(

      "invalid_grant",

      description,

    );

  }

}