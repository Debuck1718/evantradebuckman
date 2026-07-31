import { ClientId } from "../client";
import { RedirectUri } from "../client";

import { ResponseType } from "./ResponseType";
import { PkceMethod } from "./PkceMethod";

/**
 * Represents an incoming
 * OAuth Authorization Request.
 *
 * This object validates every
 * parameter before authorization
 * begins.
 */
export class AuthorizationRequest {

  private constructor(

    public readonly clientId: ClientId,

    public readonly redirectUri: RedirectUri,

    public readonly responseType: ResponseType,

    public readonly scope: string[],

    public readonly state: string,

    public readonly codeChallenge: string,

    public readonly codeChallengeMethod: PkceMethod,

  ) {}

  /**
   * Creates a validated
   * Authorization Request.
   */
  static from(params: {

    clientId: string;

    redirectUri: string;

    responseType: string;

    scope: string;

    state: string;

    codeChallenge: string;

    codeChallengeMethod: string;

  }): AuthorizationRequest {

    if (
      params.responseType !==
      ResponseType.CODE
    ) {
      throw new Error(
        "Unsupported response type."
      );
    }

    if (!params.state.trim()) {
      throw new Error(
        "State is required."
      );
    }

    if (!params.codeChallenge.trim()) {
      throw new Error(
        "PKCE code challenge is required."
      );
    }

    if (
      params.codeChallengeMethod !==
      PkceMethod.S256
    ) {
      throw new Error(
        "Only S256 PKCE is supported."
      );
    }

    const scopes =
      params.scope
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    return new AuthorizationRequest(

      ClientId.from(
        params.clientId
      ),

      RedirectUri.from(
        params.redirectUri
      ),

      ResponseType.CODE,

      scopes,

      params.state,

      params.codeChallenge,

      PkceMethod.S256,

    );

  }

}