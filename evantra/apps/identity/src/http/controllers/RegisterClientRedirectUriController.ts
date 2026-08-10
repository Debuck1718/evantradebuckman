import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  RegisterClientRedirectUriWorkflow,
} from "../../workflows";

/**
 * Registers a Redirect URI for an OAuth client.
 */
export class RegisterClientRedirectUriController {
  constructor(
    private readonly workflow:
      RegisterClientRedirectUriWorkflow,
  ) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const clientId =
        String(request.body.clientId ?? "").trim();

      const redirectUri =
        String(request.body.redirectUri ?? "").trim();

      const primary =
        request.body.primary === true ||
        request.body.primary === "true";

      if (!clientId || !redirectUri) {
        response.status(400).json({
          error: {
            code: "INVALID_REQUEST",
            message:
              "clientId and redirectUri are required.",
          },
        });

        return;
      }

      const result =
        await this.workflow.execute({
          clientId,
          redirectUri,
          primary,
        });

      response.status(201).json({
        redirectUri: {
          id: result.id,
          clientId: result.clientId,
          redirectUri: result.redirectUri.value(),
          primary: result.isPrimary(),
          createdAt:
            result.createdAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
