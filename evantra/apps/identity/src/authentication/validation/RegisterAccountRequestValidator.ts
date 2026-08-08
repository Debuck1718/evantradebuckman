import {
  RegisterAccountRequest,
} from "../requests";

/**
 * Validates an account
 * registration request.
 */
export class RegisterAccountRequestValidator {
  static validate(
    request: unknown,
  ): asserts request is RegisterAccountRequest {
    if (
      !request ||
      typeof request !== "object"
    ) {
      throw new Error(
        "Invalid registration request.",
      );
    }

    const body =
      request as Record<
        string,
        unknown
      >;

    // ======================================================
    // First name
    // ======================================================

    if (
      typeof body.firstName !== "string" ||
      !body.firstName.trim()
    ) {
      throw new Error(
        "First name is required.",
      );
    }

    // ======================================================
    // Last name
    // ======================================================

    if (
      typeof body.lastName !== "string" ||
      !body.lastName.trim()
    ) {
      throw new Error(
        "Last name is required.",
      );
    }

    // ======================================================
    // Evantra ID
    // ======================================================

    if (
      typeof body.evantraId !== "string" ||
      !body.evantraId.trim()
    ) {
      throw new Error(
        "Evantra ID is required.",
      );
    }

    // ======================================================
    // Contact email
    // ======================================================

    if (
      typeof body.contactEmail !== "string" ||
      !body.contactEmail.trim()
    ) {
      throw new Error(
        "Contact email is required.",
      );
    }

    // ======================================================
    // Password
    // ======================================================

    if (
      typeof body.password !== "string" ||
      !body.password
    ) {
      throw new Error(
        "Password is required.",
      );
    }
  }
}