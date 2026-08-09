import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  RotateClientSecretWorkflow,
} from "../workflows";

/**
 * Temporarily rotates an OAuth Client Secret.
 *
 * DEVELOPMENT/ADMIN TOOL ONLY.
 *
 * The plain client secret is returned once.
 */
export class RotateClientSecretController {

  constructor(
    private readonly workflow:
      RotateClientSecretWorkflow,
  ) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {

    try {

      const clientId =
        String(
          request.body.clientId ?? "",
        ).trim();

      if (!clientId) {

        response
          .status(400)
          .json({
            error: {
              code: "INVALID_REQUEST",
              message:
                "clientId is required.",
            },
          });

        return;
      }

      const result =
        await this.workflow.execute({

          clientId,

        });

      response
        .status(200)
        .json({

          clientId:
            result.client.clientId.value(),

          clientSecret:
            result.clientSecret,

          message:
            "Client secret rotated successfully. Store the client secret securely; it will not be returned again.",

        });

    } catch (error) {

      next(error);

    }

  }

}