/**
 * Evantra Identity — OAuth 2.0 client.
 *
 * Server-side and native implementations
 * for the Authorization Code flow with
 * PKCE.
 *
 * Browser applications should normally use
 * `@evantra-identity/react`, which wraps
 * this logic with the redirect and storage
 * handling a browser needs.
 *
 * RFC6749 — OAuth 2.0
 * RFC7636 — PKCE
 * RFC8252 — OAuth 2.0 for Native Apps
 */

export type EvantraRedirectTarget =
  | "web"
  | "native"
  | "loopback";

export interface EvantraClientOptions {
  /**
   * Identity API origin.
   *
   * Defaults to https://evantra-headquarters.onrender.com
   */
  apiBaseUrl?: string;

  /**
   * Identity web application origin.
   *
   * Defaults to https://identity.evantradebuckman.com
   */
  identityWebBaseUrl?: string;

  clientId: string;

  /**
   * Confidential clients only.
   *
   * Server-side applications may hold a
   * secret. Browsers, mobile apps and
   * desktop apps are public clients and
   * must rely on PKCE alone.
   */
  clientSecret?: string;

  /**
   * Registered redirect URI.
   *
   * Web:      https://app.example.com/oauth/callback
   * Native:   com.example.app://oauth/callback
   * Loopback: http://127.0.0.1:53682/callback
   */
  redirectUri: string;

  /**
   * Requested scopes.
   *
   * Defaults to "openid profile email".
   */
  scope?: string;

  /**
   * Overrides the global fetch, useful in
   * tests and non-standard runtimes.
   */
  fetch?: typeof fetch;
}

export interface EvantraTokenSet {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
}

export interface EvantraIdentityProfile {
  sub: string;
  evantra_id?: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
}

export interface EvantraPkcePair {
  verifier: string;
  challenge: string;
}

export interface EvantraAuthorizeParams {
  codeChallenge: string;
  codeChallengeMethod?: "S256";
  scope?: string;
  state?: string;
  nonce?: string;
  responseType?: "code";
  prompt?: "login" | "consent" | "none";
}

export interface EvantraCallbackResult {
  code: string;
  state: string | null;
}

export const EVANTRA_DEFAULT_SCOPE =
  "openid profile email";

const DEFAULT_API_BASE_URL =
  "https://evantra-headquarters.onrender.com";

const DEFAULT_IDENTITY_WEB_BASE_URL =
  "https://identity.evantradebuckman.com";

/**
 * Error raised for any OAuth failure.
 *
 * `error` carries the RFC6749 error code
 * such as invalid_grant or access_denied.
 */
export class EvantraOAuthError extends Error {
  constructor(
    public readonly error: string,
    message: string,
    public readonly status?: number,
  ) {
    super(message);

    this.name = "EvantraOAuthError";
  }
}

function normalizeBaseUrl(
  baseUrl: string,
): string {
  return baseUrl.replace(/\/+$/, "");
}

function base64UrlEncode(
  bytes: Uint8Array,
): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);

  if (
    typeof globalThis.crypto === "undefined" ||
    typeof globalThis.crypto.getRandomValues !==
    "function"
  ) {
    throw new EvantraOAuthError(
      "crypto_unavailable",
      "A cryptographically secure random source is required.",
    );
  }

  globalThis.crypto.getRandomValues(bytes);

  return bytes;
}

/**
 * Creates a PKCE verifier and its S256
 * challenge.
 *
 * Store the verifier securely until the
 * authorization response arrives, then
 * send it to the token endpoint.
 */
export async function createEvantraPkcePair(): Promise<EvantraPkcePair> {
  const verifier = Array.from(
    randomBytes(64),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");

  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );

  return {
    verifier,
    challenge: base64UrlEncode(
      new Uint8Array(digest),
    ),
  };
}

/**
 * Generates an unguessable OAuth state
 * value for CSRF protection.
 */
export function createEvantraState(): string {
  return Array.from(
    randomBytes(16),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
}

/**
 * Reads an authorization response out of a
 * query string.
 *
 * Shared by the web, native and loopback
 * redirect handlers.
 */
export function parseEvantraCallback(
  query: string,
  expectedState?: string | null,
): EvantraCallbackResult {
  const params = new URLSearchParams(
    query.replace(/^\?/, ""),
  );

  const error = params.get("error");

  if (error) {
    throw new EvantraOAuthError(
      error,
      params.get("error_description") ??
      `Authorization failed: ${error}`,
    );
  }

  const code = params.get("code");

  if (!code) {
    throw new EvantraOAuthError(
      "invalid_request",
      "The authorization response did not include a code.",
    );
  }

  const state = params.get("state");

  if (
    expectedState !== undefined &&
    expectedState !== null &&
    state !== expectedState
  ) {
    throw new EvantraOAuthError(
      "invalid_state",
      "The authorization response state did not match.",
    );
  }

  return { code, state };
}

/**
 * OAuth 2.0 client for an Evantra Identity
 * application.
 */
export class EvantraOAuthClient {
  private readonly apiBaseUrl: string;

  private readonly identityWebBaseUrl: string;

  constructor(
    private readonly options: EvantraClientOptions,
  ) {
    this.apiBaseUrl = normalizeBaseUrl(
      options.apiBaseUrl ?? DEFAULT_API_BASE_URL,
    );

    this.identityWebBaseUrl = normalizeBaseUrl(
      options.identityWebBaseUrl ??
      DEFAULT_IDENTITY_WEB_BASE_URL,
    );
  }

  private fetcher(): typeof fetch {
    return this.options.fetch ?? globalThis.fetch;
  }

  /**
   * Builds the /oauth/authorize URL.
   *
   * Point the user's browser or system web
   * view at this URL. If they have no
   * session, the identity service redirects
   * them through sign in (and registration,
   * and email verification) before issuing
   * the authorization code and returning
   * them to redirectUri.
   */
  createAuthorizeUrl(
    params: EvantraAuthorizeParams,
  ): string {
    const query = new URLSearchParams();

    query.set("client_id", this.options.clientId);
    query.set(
      "redirect_uri",
      this.options.redirectUri,
    );
    query.set(
      "code_challenge",
      params.codeChallenge,
    );
    query.set(
      "code_challenge_method",
      params.codeChallengeMethod ?? "S256",
    );
    query.set(
      "response_type",
      params.responseType ?? "code",
    );
    query.set(
      "scope",
      params.scope ??
      this.options.scope ??
      EVANTRA_DEFAULT_SCOPE,
    );

    if (params.state) {
      query.set("state", params.state);
    }

    if (params.nonce) {
      query.set("nonce", params.nonce);
    }

    if (params.prompt) {
      query.set("prompt", params.prompt);
    }

    return `${this.apiBaseUrl}/oauth/authorize?${query.toString()}`;
  }

  /**
   * Exchanges an authorization code for
   * tokens.
   */
  async exchangeCode(params: {
    code: string;
    codeVerifier: string;
  }): Promise<EvantraTokenSet> {
    const body = new URLSearchParams();

    body.set(
      "grant_type",
      "authorization_code",
    );
    body.set("code", params.code);
    body.set(
      "redirect_uri",
      this.options.redirectUri,
    );
    body.set(
      "client_id",
      this.options.clientId,
    );
    body.set(
      "code_verifier",
      params.codeVerifier,
    );

    if (this.options.clientSecret) {
      body.set(
        "client_secret",
        this.options.clientSecret,
      );
    }

    return this.tokenRequest(body);
  }

  /**
   * Exchanges a refresh token for a new
   * access token.
   */
  async refresh(
    refreshToken: string,
  ): Promise<EvantraTokenSet> {
    const body = new URLSearchParams();

    body.set("grant_type", "refresh_token");
    body.set("refresh_token", refreshToken);
    body.set(
      "client_id",
      this.options.clientId,
    );

    if (this.options.clientSecret) {
      body.set(
        "client_secret",
        this.options.clientSecret,
      );
    }

    return this.tokenRequest(body);
  }

  /**
   * Revokes an access or refresh token.
   */
  async revoke(token: string): Promise<void> {
    const body = new URLSearchParams();

    body.set("token", token);
    body.set(
      "client_id",
      this.options.clientId,
    );

    if (this.options.clientSecret) {
      body.set(
        "client_secret",
        this.options.clientSecret,
      );
    }

    await this.fetcher()(
      `${this.apiBaseUrl}/oauth/revoke`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: body.toString(),
        cache: "no-store",
      },
    );
  }

  /**
   * Fetches the OpenID Connect UserInfo
   * resource.
   */
  async getUserInfo(
    accessToken: string,
  ): Promise<EvantraIdentityProfile> {
    const response = await this.fetcher()(
      `${this.apiBaseUrl}/oauth/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new EvantraOAuthError(
        "userinfo_failed",
        `The identity service returned ${response.status}.`,
        response.status,
      );
    }

    return (await response.json()) as EvantraIdentityProfile;
  }

  /**
   * Runs the full code exchange and then
   * loads the profile in one step, which is
   * what most client applications want.
   */
  async completeAuthorization(params: {
    code: string;
    codeVerifier: string;
  }): Promise<{
    tokens: EvantraTokenSet;
    profile: EvantraIdentityProfile;
  }> {
    const tokens = await this.exchangeCode(params);

    const profile = await this.getUserInfo(
      tokens.access_token,
    );

    return { tokens, profile };
  }

  private async tokenRequest(
    body: URLSearchParams,
  ): Promise<EvantraTokenSet> {
    const response = await this.fetcher()(
      `${this.apiBaseUrl}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: body.toString(),
        cache: "no-store",
      },
    );

    const data = (await response
      .json()
      .catch(() => null)) as
      | (EvantraTokenSet & {
        error?: string;
        error_description?: string;
      })
      | null;

    if (!response.ok || data?.error) {
      throw new EvantraOAuthError(
        data?.error ?? "token_exchange_failed",
        data?.error_description ??
        `The identity service returned ${response.status}.`,
        response.status,
      );
    }

    if (!data?.access_token) {
      throw new EvantraOAuthError(
        "invalid_response",
        "The identity service did not return an access token.",
        response.status,
      );
    }

    return data;
  }
}