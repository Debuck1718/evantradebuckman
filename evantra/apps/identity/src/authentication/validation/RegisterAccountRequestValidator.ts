import {
  RegisterAccountRequest,
} from "../requests";

/**
 * Validates an account
 * registration request.
 */
export class RegisterAccountRequestValidator {

  static validate(
    request: RegisterAccountRequest,
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

      !request.contactEmail ||

      !request.contactEmail.trim()

    ) {

      throw new Error(

        "Contact email is required.",

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