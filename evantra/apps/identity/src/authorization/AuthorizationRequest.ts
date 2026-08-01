import {
  ClientId,
  RedirectUri,
} from "../client";

import {
  ResponseType,
} from "./ResponseType";

import {
  PkceMethod,
} from "./PkceMethod";

import {
  InvalidRequestError,
  InvalidScopeError,
} from "../oauth/errors";

/**
 * Represents an incoming
 * OAuth Authorization Request.
 *
 * RFC6749
 * RFC7636
 */
export class AuthorizationRequest {

  private constructor(

    public readonly clientId: ClientId,

    public readonly redirectUri: RedirectUri,

    public readonly responseType: ResponseType,

    private readonly requestedScopes: string[],

    /**
     * OAuth state.
     *
     * Optional by specification.
     */
    public readonly state: string | null,

    /**
     * PKCE Code Challenge.
     */
    public readonly codeChallenge: string,

    /**
     * PKCE Method.
     */
    public readonly codeChallengeMethod: PkceMethod,

    /**
     * Reserved for OpenID Connect.
     */
    public readonly nonce: string | null,

  ) {}

  /**
   * Creates a validated
   * Authorization Request.
   */
  static from(params: {

    clientId: string;

    redirectUri: string;

    responseType: string;

    scope?: string;

    state?: string;

    codeChallenge: string;

    codeChallengeMethod: string;

    nonce?: string;

  }): AuthorizationRequest {

    // ======================================================
    // Response Type
    // ======================================================

    if (
      params.responseType !==
      ResponseType.CODE
    ) {

      throw new InvalidRequestError(
        "Unsupported response_type.",
      );

    }

    // ======================================================
    // PKCE Challenge
    // ======================================================

    if (
      !params.codeChallenge.trim()
    ) {

      throw new InvalidRequestError(
        "PKCE code_challenge is required.",
      );

    }

    // ======================================================
    // PKCE Method
    // ======================================================

    if (
      params.codeChallengeMethod !==
      PkceMethod.S256
    ) {

      throw new InvalidRequestError(
        "Only S256 PKCE is supported.",
      );

    }

    // ======================================================
    // Scope
    // ======================================================

    const scopes =
      (params.scope ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (
      scopes.length === 0
    ) {

      throw new InvalidScopeError();

    }

    return new AuthorizationRequest(

      ClientId.from(
        params.clientId,
      ),

      RedirectUri.from(
        params.redirectUri,
      ),

      ResponseType.CODE,

      scopes,

      params.state?.trim() || null,

      params.codeChallenge,

      PkceMethod.S256,

      params.nonce?.trim() || null,

    );

  }

  /**
   * Returns every requested scope.
   */
  scopes(): readonly string[] {

    return [
      ...this.requestedScopes,
    ];

  }

  /**
   * Returns true if the request
   * contains a scope.
   */
  hasScope(
    scope: string,
  ): boolean {

    return this.requestedScopes.includes(
      scope,
    );

  }

}