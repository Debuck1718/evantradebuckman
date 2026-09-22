import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  AuthorizeWorkflow,
  ValidateBrowserSessionWorkflow,
} from "../../workflows";

import {
  AuthorizationRequest,
} from "../../authorization";

import {
  AuthorizationResponseSerializer,
} from "../oauth/serializers/AuthorizationResponseSerializer";

/**
 * Public URL of the Evantra Identity web
 * application.
 *
 * This is where human-facing screens
 * (sign in, registration, verification)
 * live. The API host itself serves JSON
 * only, so an unauthenticated OAuth
 * request must be handed to this origin
 * to collect credentials.
 */
function identityWebUrl(): string {
  return (
    process.env.EVANTRA_IDENTITY_WEB_URL ??
    "http://localhost:3001"
  ).replace(/\/$/, "");
}

/**
 * OAuth Authorization Endpoint.
 *
 * GET /oauth/authorize
 *
 * RFC6749
 * RFC7636
 */
export class AuthorizationController {

  constructor(
    private readonly workflow:
      AuthorizeWorkflow,
    private readonly validateSession:
      ValidateBrowserSessionWorkflow,
  ) {}

  /**
   * Handles an OAuth
   * Authorization Request.
   */
  async handle(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {

    try {

      // ======================================================
      // Authentication
      // ======================================================

      const sessionIdCandidates = [
        request.cookies?.evantra_session_id,
        request.cookies?.session_id,
      ];

      const sessionId =
        sessionIdCandidates
          .map((value) =>
            typeof value === "string"
              ? value.trim()
              : "",
          )
          .find((value) => Boolean(value));

      /*
       * Resolve the authenticated account.
       *
       * When there is no valid browser
       * session the user is not an error
       * case: they simply need to sign in
       * first. RFC6749 section 4.1.1 states
       * the authorization endpoint directs
       * the resource owner back to the
       * client afterwards, so we bounce
       * through the identity web app with
       * the entire authorization request
       * preserved as returnTo.
       */
      let accountId: string | null = null;

      if (sessionId) {
        try {
          const session =
            await this.validateSession.execute({
              sessionId,
            });

          accountId =
            session.identity.accountId;
        } catch {
          accountId = null;
        }
      }

      if (!accountId) {
        const params = new URLSearchParams();

        for (
          const key of [
            "client_id",
            "redirect_uri",
            "response_type",
            "scope",
            "state",
            "nonce",
            "code_challenge",
            "code_challenge_method",
          ]
        ) {
          const value = request.query[key];

          if (typeof value === "string" && value) {
            params.set(key, value);
          }
        }

        const returnTo =
          `/oauth/authorize?${params.toString()}`;

        response.redirect(
          `${identityWebUrl()}/login?returnTo=${encodeURIComponent(
            returnTo,
          )}`,
        );

        return;
      }

      // ======================================================
      // Build Authorization Request
      // ======================================================

      const authorizationRequest =
  AuthorizationRequest.from({

    clientId:
      String(
        request.query.client_id ?? "",
      ),

    redirectUri:
      String(
        request.query.redirect_uri ?? "",
      ),

    responseType:
      String(
        request.query.response_type ?? "",
      ),

    codeChallenge:
      String(
        request.query.code_challenge ?? "",
      ),

    codeChallengeMethod:
      String(
        request.query.code_challenge_method ?? "",
      ),

    ...(request.query.scope !== undefined
      ? {
          scope:
            String(
              request.query.scope,
            ),
        }
      : {}),

    ...(request.query.state !== undefined
      ? {
          state:
            String(
              request.query.state,
            ),
        }
      : {}),

    ...(request.query.nonce !== undefined
      ? {
          nonce:
            String(
              request.query.nonce,
            ),
        }
      : {}),

  });

      // ======================================================
      // Execute Workflow
      // ======================================================

      const authorizationResponse =
        await this.workflow.execute({

          accountId,

          request:
            authorizationRequest,

        });

      // ======================================================
      // Redirect
      // ======================================================

      response.redirect(

        AuthorizationResponseSerializer.serialize(
          authorizationResponse,
        ),

      );

    } catch (error) {

      next(error);

    }
  }
}