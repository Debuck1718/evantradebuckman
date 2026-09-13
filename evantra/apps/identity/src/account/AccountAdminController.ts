import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  ReactivateAccountWorkflow,
} from "../workflows";

function hasValidAdminKey(
  request: Request,
): boolean {
  const expected =
    process.env.EVANTRA_ACCOUNT_ADMIN_KEY;

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
 * Handles privileged account recovery.
 */
export class AccountAdminController {

  constructor(
    private readonly reactivate:
      ReactivateAccountWorkflow,
  ) {}

  async reactivateAccount(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!process.env.EVANTRA_ACCOUNT_ADMIN_KEY) {
        response.status(503).json({
          error: {
            code: "ACCOUNT_ADMIN_DISABLED",
            message:
              "Account administration is disabled.",
          },
        });
        return;
      }

      if (!hasValidAdminKey(request)) {
        response.status(403).json({
          error: {
            code: "FORBIDDEN",
            message: "Invalid account admin key.",
          },
        });
        return;
      }

      const accountId =
        String(request.body?.accountId ?? "").trim();
      const reason =
        String(request.body?.reason ?? "").trim();

      if (!accountId || !reason) {
        response.status(400).json({
          error: {
            code: "INVALID_REQUEST",
            message:
              "accountId and reason are required.",
          },
        });
        return;
      }

      const account =
        await this.reactivate.execute({
          accountId,
          reason,
        });

      response.status(200).json({
        account: {
          id: account.id,
          evantraId: account.evantraId.value(),
          status: account.getStatus(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}