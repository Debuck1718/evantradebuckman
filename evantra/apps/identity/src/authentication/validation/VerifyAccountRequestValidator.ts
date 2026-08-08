import {
  VerifyAccountRequest,
} from "../requests";

/**
 * Validates an account verification request.
 */
export class VerifyAccountRequestValidator {

  static validate(
    request: VerifyAccountRequest,
  ): void {

    if (
      !request.token ||
      !request.token.trim()
    ) {
      throw new Error(
        "Verification token is required.",
      );
    }
  }
}