import { OAuthError } from "./OAuthError";

/**
 * Authorization Grant is invalid.
 */
export class InvalidGrantError extends OAuthError {

  public readonly error: string;
  public readonly description: string;

  constructor(
    description: string,
  ) {
    super(
      "invalid_grant",
      description,
    );

    this.error = "invalid_grant";
    this.description = description;
  }

}