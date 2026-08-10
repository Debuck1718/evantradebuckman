import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  RegisterClientWorkflow,
} from "../../workflows";

/**
 * Registers a new OAuth client.
 */
export class RegisterClientController {
  constructor(
    private readonly workflow:
      RegisterClientWorkflow,
  ) {}

  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const ownerAccountId =
        String(
          request.body.ownerAccountId ?? "",
        ).trim();

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

      if (
        !ownerAccountId ||
        !name ||
        !slug
      ) {
        response.status(400).json({
          error: {
            code: "INVALID_REQUEST",
            message:
              "ownerAccountId, name and slug are required.",
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
      } = {
        ownerAccountId,
        name,
        slug,
        firstParty,
      };

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
