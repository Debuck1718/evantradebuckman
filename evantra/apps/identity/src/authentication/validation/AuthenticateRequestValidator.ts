import {
  AuthenticateRequest,
} from "../requests";

/**
 * Validates an
 * Authenticate Request.
 */
export class AuthenticateRequestValidator {

  /**
   * Validates an
   * Authenticate Request.
   */
  static validate(
    request: AuthenticateRequest,
  ): void {

    if (

      !request.evantraId ||

      !request.evantraId.trim()

    ) {

      throw new Error(

        "Evantra ID is required.",

      );

    }

    if (

      !request.password ||

      !request.password.trim()

    ) {

      throw new Error(

        "Password is required.",

      );

    }

  }

}