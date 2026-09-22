/**
 * Evantra Identity — OAuth 2.0 / PKCE core.
 *
 * Framework-agnostic. Safe to use from
 * React, React Native, Expo, Electron or
 * a plain browser bundle.
 *
 * Implements the Authorization Code flow
 * with PKCE as defined by:
 *
 *   RFC6749 — OAuth 2.0
 *   RFC7636 — PKCE
 *   RFC8252 — OAuth 2.0 for Native Apps
 */

export type EvantraRedirectTarget =
  | "web"
  | "native"
  | "loopback";

/**
 * Where the authorization code is
 * delivered after the user consents.
 *
 *  - web      a browser application,
 *             captured from window.location
 *
 *  - native   a mobile app deep link,
 *             e.g. com.example.app://callback
 *
 *  - loopback a local HTTP listener,
 *             e.g. http://127.0.0.1:53682/callback
 */
export interface EvantraRedirect {
  /**
   * The exact URI registered against the
   * OAuth client in the Evantra dashboard.
   */
  uri: string;

  /**
   * How the code is captured. Defaults to
   * "web" when omitted.
   */
  target?: EvantraRedirectTarget;
}

export interface EvantraAuthorizeParams {
  clientId: string;

  /**
   * The registered redirect URI.
   */
  redirectUri: string;

  /**
   * PKCE code challenge (S256).
   */
  codeChallenge: string;

  codeChallengeMethod?: "S256";

  /**
   * Requested scopes.
   *
   * Defaults to "openid profile email".
   */
  scope?: string;

  /**
   * Opaque value echoed back on the
   * redirect. Use it to defend against
   * CSRF by comparing against a value you
   * stored before starting the flow.
   */
  state?: string;

  /**
   * OpenID Connect nonce.
   */
  nonce?: string;

  responseType?: "code";

  /**
   * Optional prompt hint passed through to
   * the identity service.
   */
  prompt?: "login" | "consent" | "none";
}

export interface EvantraPkcePair {
  verifier: string;
  challenge: string;
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

export const EVANTRA_DEFAULT_SCOPE =
  "openid profile email";

const DEFAULT_IDENTITY_WEB_BASE_URL =
  "https://identity.evantradebuckman.com";

const DEFAULT_IDENTITY_API_BASE_URL =
  "https://evantra-headquarters.onrender.com";

export function normalizeBaseUrl(
  baseUrl: string,
): string {
  return baseUrl.replace(/\/+$/, "");
}

/* ------------------------------------------------------------------ */
/* URL builders                                                        */
/* ------------------------------------------------------------------ */

/**
 * Builds the sign-in URL.
 *
 * The identity app only accepts a
 * same-origin relative returnTo so a
 * crafted link can never bounce a
 * visitor off-origin.
 */
export function createEvantraLoginUrl(
  baseUrl: string,
  returnTo?: string,
): string {
  const base = normalizeBaseUrl(baseUrl);

  if (!returnTo) {
    return `${base}/login`;
  }

  return `${base}/login?returnTo=${encodeURIComponent(
    returnTo,
  )}`;
}

/**
 * Builds the registration URL.
 *
 * Registration honours returnTo so an
 * OAuth client survives the detour
 * through sign-up and email verification.
 */
export function createEvantraRegisterUrl(
  baseUrl: string,
  returnTo?: string,
): string {
  const base = normalizeBaseUrl(baseUrl);

  if (!returnTo) {
    return `${base}/register`;
  }

  return `${base}/register?returnTo=${encodeURIComponent(
    returnTo,
  )}`;
}

/**
 * Builds a /oauth/authorize URL.
 *
 * The identity host serves JSON only, so
 * this URL is the API authorization
 * endpoint. It redirects to the identity
 * web app for credentials when the user
 * has no session, then issues the
 * authorization code and redirects back
 * to redirectUri.
 */
export function createEvantraAuthorizeUrl(
  baseUrl: string,
  params: EvantraAuthorizeParams,
): string {
  const base = normalizeBaseUrl(baseUrl);

  const query = new URLSearchParams();

  query.set("client_id", params.clientId);
  query.set("redirect_uri", params.redirectUri);
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
    params.scope ?? EVANTRA_DEFAULT_SCOPE,
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

  return `${base}/oauth/authorize?${query.toString()}`;
}

/* ------------------------------------------------------------------ */
/* PKCE                                                                */
/* ------------------------------------------------------------------ */

function base64UrlEncode(bytes: Uint8Array): string {
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
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues ===
    "function"
  ) {
    globalThis.crypto.getRandomValues(bytes);

    return bytes;
  }

  throw new Error(
    "A cryptographically secure random source is required. " +
    "Provide a crypto.getRandomValues polyfill on this platform.",
  );
}

/**
 * Creates a PKCE verifier and its S256
 * challenge.
 */
export async function createEvantraPkcePair(): Promise<EvantraPkcePair> {
  const bytes = randomBytes(64);

  const verifier = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
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
 * Generates an unguessable state value.
 *
 * Store it before redirecting and compare
 * it on return to defend against CSRF.
 */
export function createEvantraState(): string {
  const bytes = randomBytes(16);

  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

/* ------------------------------------------------------------------ */
/* Redirect handling                                                   */
/* ------------------------------------------------------------------ */

export interface EvantraCallbackResult {
  code: string;
  state: string | null;
}

export class EvantraOAuthError extends Error {
  constructor(
    public readonly error: string,
    message: string,
  ) {
    super(message);

    this.name = "EvantraOAuthError";
  }
}

function parseCallbackQuery(
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

  /*
   * A mismatched state means the response
   * did not originate from the request we
   * started, so the code is discarded.
   */
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

  return {
    code,
    state,
  };
}

/**
 * Reads the authorization code from the
 * current browser URL.
 *
 * Call this from your OAuth callback page.
 * The code is removed from the address bar
 * afterwards so it is not bookmarked or
 * shared.
 */
export function consumeEvantraWebCallback(
  expectedState?: string | null,
): EvantraCallbackResult {
  if (
    typeof window === "undefined"
  ) {
    throw new EvantraOAuthError(
      "invalid_request",
      "consumeEvantraWebCallback must run in a browser.",
    );
  }

  const result = parseCallbackQuery(
    window.location.search,
    expectedState,
  );

  if (
    typeof window.history?.replaceState ===
    "function"
  ) {
    const url = new URL(window.location.href);

    url.search = "";

    window.history.replaceState(
      {},
      document.title,
      url.toString(),
    );
  }

  return result;
}

/**
 * Parses a native deep link URL.
 *
 * React Native / Expo example:
 *
 * ```ts
 * const url = await Linking.getInitialURL();
 * const { code } = consumeEvantraNativeCallback(url, savedState);
 * ```
 */
export function consumeEvantraNativeCallback(
  url: string,
  expectedState?: string | null,
): EvantraCallbackResult {
  const queryIndex = url.indexOf("?");

  if (queryIndex === -1) {
    throw new EvantraOAuthError(
      "invalid_request",
      "The deep link did not contain an authorization response.",
    );
  }

  /*
   * Custom schemes are not always parsed
   * consistently by URL across runtimes,
   * so the query string is read directly.
   */
  return parseCallbackQuery(
    url.slice(queryIndex),
    expectedState,
  );
}

/* ------------------------------------------------------------------ */
/* Token exchange                                                      */
/* ------------------------------------------------------------------ */

export interface EvantraTokenClientConfig {
  /**
   * Identity API base URL.
   *
   * Defaults to https://evantra-headquarters.onrender.com
   */
  apiBaseUrl?: string;

  clientId: string;

  /**
   * Confidential clients only.
   *
   * Never embed a client secret in a
   * browser bundle or a mobile app binary:
   * those are public clients and must rely
   * on PKCE alone.
   */
  clientSecret?: string;

  /**
   * Overrides the global fetch. Handy for
   * React Native and for tests.
   */
  fetch?: typeof fetch;
}

async function readTokenResponse(
  response: Response,
): Promise<EvantraTokenSet> {
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
    );
  }

  if (!data?.access_token) {
    throw new EvantraOAuthError(
      "invalid_response",
      "The identity service did not return an access token.",
    );
  }

  return data;
}

/**
 * Exchanges an authorization code for
 * tokens.
 */
export async function exchangeEvantraCode(
  config: EvantraTokenClientConfig,
  params: {
    code: string;
    codeVerifier: string;
    redirectUri: string;
  },
): Promise<EvantraTokenSet> {
  const base = normalizeBaseUrl(
    config.apiBaseUrl ??
    DEFAULT_IDENTITY_API_BASE_URL,
  );

  const body = new URLSearchParams();

  body.set("grant_type", "authorization_code");
  body.set("code", params.code);
  body.set("redirect_uri", params.redirectUri);
  body.set("client_id", config.clientId);
  body.set("code_verifier", params.codeVerifier);

  if (config.clientSecret) {
    body.set("client_secret", config.clientSecret);
  }

  const response = await (config.fetch ??
    globalThis.fetch)(`${base}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    });

  return readTokenResponse(response);
}

/**
 * Exchanges a refresh token for a new
 * access token.
 */
export async function refreshEvantraToken(
  config: EvantraTokenClientConfig,
  refreshToken: string,
): Promise<EvantraTokenSet> {
  const base = normalizeBaseUrl(
    config.apiBaseUrl ??
    DEFAULT_IDENTITY_API_BASE_URL,
  );

  const body = new URLSearchParams();

  body.set("grant_type", "refresh_token");
  body.set("refresh_token", refreshToken);
  body.set("client_id", config.clientId);

  if (config.clientSecret) {
    body.set("client_secret", config.clientSecret);
  }

  const response = await (config.fetch ??
    globalThis.fetch)(`${base}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    });

  return readTokenResponse(response);
}

/**
 * Revokes an access or refresh token.
 */
export async function revokeEvantraToken(
  config: EvantraTokenClientConfig,
  token: string,
): Promise<void> {
  const base = normalizeBaseUrl(
    config.apiBaseUrl ??
    DEFAULT_IDENTITY_API_BASE_URL,
  );

  const body = new URLSearchParams();

  body.set("token", token);
  body.set("client_id", config.clientId);

  if (config.clientSecret) {
    body.set("client_secret", config.clientSecret);
  }

  await (config.fetch ?? globalThis.fetch)(
    `${base}/oauth/revoke`,
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
 * resource for an access token.
 */
export async function fetchEvantraUserInfo(
  accessToken: string,
  options?: {
    apiBaseUrl?: string;
    fetch?: typeof fetch;
  },
): Promise<EvantraIdentityProfile> {
  const base = normalizeBaseUrl(
    options?.apiBaseUrl ??
    DEFAULT_IDENTITY_API_BASE_URL,
  );

  const response = await (options?.fetch ??
    globalThis.fetch)(`${base}/oauth/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

  if (!response.ok) {
    throw new EvantraOAuthError(
      "userinfo_failed",
      `The identity service returned ${response.status}.`,
    );
  }

  return (await response.json()) as EvantraIdentityProfile;
}

/**
 * Default identity web application origin.
 */
export function defaultIdentityWebBaseUrl(): string {
  return DEFAULT_IDENTITY_WEB_BASE_URL;
}

/**
 * Default identity API origin.
 */
export function defaultIdentityApiBaseUrl(): string {
  return DEFAULT_IDENTITY_API_BASE_URL;
}