import {
  HttpController,
  HttpRequest,
  HttpResponse,
} from "../../http";

import {
  RegisterAccountWorkflow,
} from "../../workflows";

import {
  RegisterAccountRequest,
} from "../requests";

import {
  RegisterAccountRequestValidator,
} from "../validation";

import {
  RegisterResponseMapper,
} from "../responses";

/**
 * Handles account
 * registration.
 */
export class RegisterController
  implements HttpController {

  constructor(
    private readonly register:
      RegisterAccountWorkflow,
  ) {}

  async handle(
    request: HttpRequest,
  ): Promise<HttpResponse> {

    RegisterAccountRequestValidator.validate(
      request.body,
    );

    const body:
      RegisterAccountRequest =
        request.body;

    const account =
      await this.register.execute({

        firstName:
          body.firstName,

        lastName:
          body.lastName,

        evantraId:
          body.evantraId,

        contactEmail:
          body.contactEmail,

        password:
          body.password,

      });

    return RegisterResponseMapper.success(
      account,
    );
  }
}