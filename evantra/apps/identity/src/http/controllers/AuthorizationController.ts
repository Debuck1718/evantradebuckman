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
  InvalidRequestError,
} from "../../oauth/errors";

import {
  AuthorizationResponseSerializer,
} from "../oauth/serializers/AuthorizationResponseSerializer";

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

      if (!sessionId) {
        throw new InvalidRequestError(
          "Authenticated session is required.",
        );
      }

      let accountId: string;

      try {
        const session =
          await this.validateSession.execute({
            sessionId,
          });

        accountId =
          session.identity.accountId;
      } catch {
        throw new InvalidRequestError(
          "Authenticated session is required.",
        );
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