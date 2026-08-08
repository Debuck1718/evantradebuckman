import {
  ResendVerificationRequest,
} from "../requests";

/**
 * Validates a resend verification request.
 */
export class ResendVerificationRequestValidator {

  static validate(
    request: ResendVerificationRequest,
  ): void {

    if (
      !request.contactEmail ||
      !request.contactEmail.trim()
    ) {
      throw new Error(
        "Contact email is required.",
      );
    }
  }
}