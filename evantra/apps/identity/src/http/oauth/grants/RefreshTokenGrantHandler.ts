import {
  RefreshAccessTokenWorkflow,
} from "../../../workflows";

import {
  InvalidRequestError,
} from "../../../oauth/errors";

import {
  OAuthConfiguration,
} from "../OAuthConfiguration";

import {
  TokenGrantHandler,
} from "./TokenGrantHandler";

import {
  TokenRequest,
} from "../TokenRequest";

import {
  TokenResponse,
} from "../../../oauth";

/**
 * OAuth Refresh Token Grant.
 *
 * RFC6749 Section 6.
 */
export class RefreshTokenGrantHandler
  implements TokenGrantHandler {

  constructor(

    private readonly workflow:
      RefreshAccessTokenWorkflow,

    private readonly configuration:
      OAuthConfiguration,

  ) {}

  /**
   * Returns true if this
   * handler supports the
   * supplied grant.
   */
  supports(
    grantType: string,
  ): boolean {

    return (
      grantType ===
      "refresh_token"
    );

  }

  /**
   * Executes the
   * Refresh Token Grant.
   */
  async execute(
    request: TokenRequest,
  ): Promise<TokenResponse> {

    // ==========================================================
    // Validation
    // ==========================================================

    if (!request.client_id) {

      throw new InvalidRequestError(

        "Client ID is required.",

      );

    }

    if (!request.refresh_token) {

      throw new InvalidRequestError(

        "Refresh Token is required.",

      );

    }

    // ==========================================================
    // Execute Workflow
    // ==========================================================

    return this.workflow.execute({

      clientId:
        request.client_id,

      clientSecret:
        request.client_secret ?? "",

      refreshToken:
        request.refresh_token,

      accessTokenLifetime:
        this.configuration
          .accessTokenLifetime,

      refreshTokenLifetime:
        this.configuration
          .refreshTokenLifetime,

    });

  }

}