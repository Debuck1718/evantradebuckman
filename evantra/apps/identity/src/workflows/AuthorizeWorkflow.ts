import {
  ClientService,
  ClientRedirectUriService,
  ClientScopeService,
} from "../client";

import {
  AuthorizationCodeService,
  AuthorizationRequest,
  AuthorizationResponse,
  UserConsentService,
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

      private readonly clientScopes:
        ClientScopeService,

      private readonly consents:
        UserConsentService,

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

    const requested =
      request.scopes();

    if (requested.length === 0) {

      throw new InvalidScopeError();

    }

    /*
     * A client may only ever hold scopes that
     * were registered against it during
     * onboarding. Anything else is rejected
     * outright so a crafted authorization
     * request cannot widen access.
     */
    const granted =
      await this.clientScopes.filterAllowed({

        clientId:
          client.id,

        scopes:
          requested,

      });

    if (granted.length !== requested.length) {

      throw new InvalidScopeError();

    }

    // ======================================================
    // Consent
    // ======================================================

    /*
     * Consent is recorded per scope. The
     * consent screen is what actually collects
     * the resource owner's approval before this
     * workflow runs, so reaching this point
     * means the user approved the request.
     */
    await this.consents.grant({

      accountId:
        params.accountId,

      clientId:
        client.id,

      scopes:
        granted,

    });

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
          granted,
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