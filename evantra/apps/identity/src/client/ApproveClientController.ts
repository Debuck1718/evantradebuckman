import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  ApproveClientWorkflow,
} from "../workflows";

function authorizationEnabled(): boolean {
  return Boolean(
    process.env.EVANTRA_CLIENT_APPROVAL_ADMIN_KEY,
  );
}

function hasValidAdminKey(
  request: Request,
): boolean {
  const expected =
    process.env.EVANTRA_CLIENT_APPROVAL_ADMIN_KEY;

  if (!expected) {
    return false;
  }

  const provided =
    String(
      request.headers["x-evantra-admin-key"] ?? "",
    ).trim();

  return provided.length > 0 &&
    provided === expected;
}

/**
 * Approves a pending OAuth client.
 */
export class ApproveClientController {

  constructor(
    private readonly workflow:
      ApproveClientWorkflow,
  ) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!authorizationEnabled()) {
        response.status(503).json({
          error: {
            code: "CLIENT_APPROVAL_DISABLED",
            message:
              "Client approval endpoint is disabled.",
          },
        });

        return;
      }

      if (!hasValidAdminKey(request)) {
        response.status(403).json({
          error: {
            code: "FORBIDDEN",
            message:
              "Invalid admin approval key.",
          },
        });

        return;
      }

      const clientId =
        String(
          request.body?.clientId ?? "",
        ).trim();

      if (!clientId) {
        response.status(400).json({
          error: {
            code: "INVALID_REQUEST",
            message:
              "clientId is required.",
          },
        });

        return;
      }

      const client =
        await this.workflow.execute({
          clientId,
        });

      response.status(200).json({
        client: {
          id: client.id,
          ownerAccountId:
            client.ownerAccountId,
          clientId:
            client.clientId.value(),
          name: client.name,
          slug: client.slug,
          firstParty:
            client.firstParty,
          status:
            client.getStatus(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

}
