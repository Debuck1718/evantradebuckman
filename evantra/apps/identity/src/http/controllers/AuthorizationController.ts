import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  AuthorizeWorkflow,
} from "../../workflows";

import {
  AuthorizationRequest,
} from "../../authorization";

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

      //
      // Temporary.
      //
      // Eventually this will be
      // resolved from the authenticated
      // Evantra Session.
      //
      const accountId =
  request.headers[
    "x-account-id"
  ] as string | undefined;

if (!accountId) {

  throw new Error(
    "Authenticated account is required."
  );

}

const authorizationRequest =
  AuthorizationRequest.from({

    clientId:
      String(request.query.client_id ?? ""),

    redirectUri:
      String(request.query.redirect_uri ?? ""),

    responseType:
      String(request.query.response_type ?? ""),

    codeChallenge:
      String(request.query.code_challenge ?? ""),

    codeChallengeMethod:
      String(
        request.query.code_challenge_method ?? "",
      ),

    ...(request.query.scope !== undefined
      ? {
          scope: String(request.query.scope),
        }
      : {}),

    ...(request.query.state !== undefined
      ? {
          state: String(request.query.state),
        }
      : {}),

    ...(request.query.nonce !== undefined
      ? {
          nonce: String(request.query.nonce),
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

    }

    catch (error) {

      next(error);

    }

  }

}