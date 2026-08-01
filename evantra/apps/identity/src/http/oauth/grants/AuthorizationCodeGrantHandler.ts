import {
  ExchangeAuthorizationCodeWorkflow,
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
 * OAuth Authorization Code Grant.
 *
 * RFC6749
 * RFC7636
 */
export class AuthorizationCodeGrantHandler
  implements TokenGrantHandler {

  constructor(

    private readonly workflow:
      ExchangeAuthorizationCodeWorkflow,

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
      "authorization_code"
    );

  }

  /**
   * Executes the
   * Authorization Code Grant.
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

    if (!request.code) {

      throw new InvalidRequestError(

        "Authorization Code is required.",

      );

    }

    if (!request.redirect_uri) {

      throw new InvalidRequestError(

        "Redirect URI is required.",

      );

    }

    if (!request.code_verifier) {

      throw new InvalidRequestError(

        "PKCE code_verifier is required.",

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

      code:
        request.code,

      redirectUri:
        request.redirect_uri,

      codeVerifier:
        request.code_verifier,

      accessTokenLifetime:
        this.configuration
          .accessTokenLifetime,

      refreshTokenLifetime:
        this.configuration
          .refreshTokenLifetime,

    });

  }

}