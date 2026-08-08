import {
  ClientService,
  ClientRedirectUriService,
} from "../client";

import {
  AuthorizationCodeService,
  AuthorizationRequest,
  AuthorizationResponse,
} from "../authorization";

import {
  InvalidClientError,
  InvalidRequestError,
  InvalidScopeError,
} from "../oauth/errors";

/**
 * Begins the OAuth
 * Authorization Code Flow.
 *
 * RFC6749
 * RFC7636
 */
export class AuthorizeWorkflow {

  constructor(
    private readonly clients:
      ClientService,

    private readonly redirects:
      ClientRedirectUriService,

    private readonly authorizationCodes:
      AuthorizationCodeService,
  ) {}

  /**
   * Validates an OAuth
   * Authorization Request
   * and issues an
   * Authorization Code.
   */
  async execute(params: {
    accountId: string;
    request: AuthorizationRequest;
  }): Promise<AuthorizationResponse> {

    const request =
      params.request;

    // ======================================================
    // OAuth Client
    // ======================================================

    const client =
      await this.clients.findByClientId(
        request.clientId.value(),
      );

    if (!client) {
      throw new InvalidClientError();
    }

    if (!client.isActive()) {
      throw new InvalidClientError();
    }

    // ======================================================
    // Redirect URI
    // ======================================================

    const redirect =
      await this.redirects.findByRedirectUri(
        client.id,
        request.redirectUri,
      );

    if (!redirect) {
      throw new InvalidRequestError(
        "Redirect URI is not registered.",
      );
    }

    // ======================================================
    // Scopes
    // ======================================================

    const scopes =
      request.scopes();

    if (scopes.length === 0) {
      throw new InvalidScopeError();
    }

    // ======================================================
    // Issue Authorization Code
    // ======================================================

    const authorizationCode =
      await this.authorizationCodes.issue({

        clientId:
          client.id,

        accountId:
          params.accountId,

        redirectUri:
          redirect.redirectUri,

        codeChallenge:
          request.codeChallenge,

        codeChallengeMethod:
          request.codeChallengeMethod,

        nonce:
          request.nonce,

        scopes:
          scopes,
      });

    // ======================================================
    // OAuth Authorization Response
    // ======================================================

    return new AuthorizationResponse(

      client.id,

      authorizationCode.code,

      authorizationCode
        .redirectUri
        .value(),

      request.state,

    );
  }
}