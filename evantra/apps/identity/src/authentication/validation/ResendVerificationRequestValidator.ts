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

    if (
      request.returnTo !== undefined &&
      (
        typeof request.returnTo !== "string" ||
        !request.returnTo.startsWith("/") ||
        request.returnTo.startsWith("//")
      )
    ) {
      throw new Error(
        "Return path must be a same-origin path.",
      );
    }
  }
}