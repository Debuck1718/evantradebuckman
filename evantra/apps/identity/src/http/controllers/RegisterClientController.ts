import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  RegisterClientWorkflow,
  ValidateBrowserSessionWorkflow,
} from "../../workflows";

/**
 * Registers a new OAuth client.
 */
export class RegisterClientController {
  constructor(
    private readonly workflow:
      RegisterClientWorkflow,
    private readonly validateSession:
      ValidateBrowserSessionWorkflow,
  ) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const sessionId =
        String(
          request.cookies?.evantra_session_id ??
            request.cookies?.session_id ??
            request.header("x-session-id") ??
            "",
        ).trim();

      if (!sessionId) {
        response.status(401).json({
          error: {
            code: "UNAUTHENTICATED",
            message: "An authenticated session is required.",
          },
        });
        return;
      }

      const session =
        await this.validateSession.execute({ sessionId });

      const ownerAccountId =
        session.identity.accountId;

      const name =
        String(request.body.name ?? "").trim();

      const slug =
        String(request.body.slug ?? "").trim();

      const homepageUrl =
        request.body.homepageUrl !== undefined
          ? String(request.body.homepageUrl).trim()
          : undefined;

      const description =
        request.body.description !== undefined
          ? String(request.body.description).trim()
          : undefined;

      const firstParty =
        request.body.firstParty === true ||
        request.body.firstParty === "true";

      /*
       * "public" for browser and native apps, which
       * must never hold a secret. Anything else stays
       * confidential so the default is unchanged.
       */
      const clientType =
        request.body.clientType === "public"
          ? "public"
          : "confidential";

      /*
       * Optional explicit scope set. The workflow
       * applies the OIDC identity defaults when this
       * is omitted, so a client that says nothing
       * still gets a working sign-in.
       */
      const requestedScopes =
        Array.isArray(request.body.scopes)
          ? request.body.scopes
              .map((scope: unknown) =>
                String(scope ?? "").trim(),
              )
              .filter(Boolean)
          : undefined;

      if (
        !name ||
        !slug
      ) {
        response.status(400).json({
          error: {
            code: "INVALID_REQUEST",
            message:
              "name and slug are required.",
          },
        });

        return;
      }

      const payload: {
        ownerAccountId: string;
        name: string;
        slug: string;
        homepageUrl?: string;
        description?: string;
        firstParty?: boolean;
        clientType?: "public" | "confidential";
        scopes?: string[];
      } = {
        ownerAccountId,
        name,
        slug,
        firstParty,
        clientType,
      };

      if (requestedScopes) {
        payload.scopes = requestedScopes;
      }

      if (homepageUrl) {
        payload.homepageUrl = homepageUrl;
      }

      if (description) {
        payload.description = description;
      }

      const result =
        await this.workflow.execute(payload);

      response.status(201).json({
        client: {
          id: result.client.id,
          ownerAccountId:
            result.client.ownerAccountId,
          clientId:
            result.client.clientId.value(),
          name: result.client.name,
          slug: result.client.slug,
          homepageUrl:
            result.client.homepageUrl,
          description:
            result.client.description,
          firstParty:
            result.client.firstParty,
          clientType:
            result.client.isPublic()
              ? "public"
              : "confidential",
          scopes: requestedScopes ?? [
            "openid",
            "profile",
            "email",
          ],
          status:
            result.client.getStatus(),
          createdAt:
            result.client.createdAt.toISOString(),
        },
        clientSecret:
          result.clientSecret,
      });
    } catch (error) {
      next(error);
    }
  }
}
