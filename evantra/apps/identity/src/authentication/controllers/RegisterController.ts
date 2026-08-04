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
    request: HttpRequest<RegisterAccountRequest>,
  ): Promise<HttpResponse> {

    RegisterAccountRequestValidator.validate(
      request.body,
    );

    const account =
      await this.register.execute({

        evantraId:
          request.body.evantraId,

        contactEmail:
          request.body.contactEmail,

        password:
          request.body.password,

      });

    return RegisterResponseMapper.success(
      account,
    );

  }

}