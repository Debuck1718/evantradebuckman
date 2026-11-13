import {
  NextFunction,
  Request,
  Response,
} from "express";

import { GetClientDisplayInfoWorkflow } from "../../workflows/GetClientDisplayInfoWorkflow";

/**
 * Serves the minimal public identity used on OAuth consent screens.
 */
export class ClientDisplayInfoController {
  constructor(
    private readonly workflow: GetClientDisplayInfoWorkflow,
  ) { }

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const clientId = String(request.params.clientId ?? "").trim();

      if (!clientId) {
        response.status(400).json({
          error: {
            code: "INVALID_REQUEST",
            message: "A client ID is required.",
          },
        });
        return;
      }

      const client = await this.workflow.execute(clientId);

      if (!client) {
        response.status(404).json({
          error: {
            code: "CLIENT_NOT_FOUND",
            message: "The application could not be found.",
          },
        });
        return;
      }

      response.status(200).json({ client });
    } catch (error) {
      next(error);
    }
  }
}
