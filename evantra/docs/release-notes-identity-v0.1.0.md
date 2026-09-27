# Evantra Identity SDK v0.1.0

Add **Sign in with Evantra** to your app in one afternoon.

This release ships the official Evantra Identity SDK as prebuilt tarballs.
It covers the OAuth 2.0 Authorization Code flow with PKCE (RFC6749, RFC7636,
RFC8252) — the same protocol Google, GitHub and Apple use. You never build
a login form: you send the user to Evantra, Evantra handles sign-in,
sign-up, passwords and email verification, then returns them to your app
with a code.

> **Not on the npm registry yet.** npm publishing is blocked on the 2FA
> flow. Use the tarball URLs below — they need no npm login and the import
> paths are identical to the future registry release.

---

## 1. Pick your package

| You are building                | Install                   | Why                                          |
| ------------------------------- | ------------------------- | -------------------------------------------- |
| A website / Next.js app         | `@evantra-identity/react` | Provider, buttons and URL helpers included   |
| A React Native or Expo app      | `@evantra-identity/react` | Same package, plus native deep-link handling |
| A backend, API or CLI           | `@evantra-identity/sdk`   | `EvantraOAuthClient`, no browser assumptions |
| A desktop app (Electron, Tauri) | `@evantra-identity/sdk`   | Loopback redirect support                    |

Both packages ship as ESM with TypeScript declarations, MIT licensed,
Node 18+.

---

## 2. Install

```bash
npm install https://github.com/Debuck1718/evantradebuckman/releases/download/identity-v0.1.0/evantra-identity-sdk-0.1.0.tgz
npm install https://github.com/Debuck1718/evantradebuckman/releases/download/identity-v0.1.0/evantra-identity-react-0.1.0.tgz
```

`@evantra-identity/react` needs `react >=18` as a peer dependency.
`@evantra-identity/sdk` has no runtime dependencies at all.

---

## 3. Get your credentials (one-time)

In the Evantra workspace, go to **Applications → Register Application**. You
receive:

| Value           | Example            | Notes                                                             |
| --------------- | ------------------ | ----------------------------------------------------------------- |
| `client_id`     | `evt_client_9f2c…` | Public. Safe to embed in your app.                                |
| `client_secret` | `evt_secret_…`     | Confidential clients only. Never ship in a browser or mobile app. |

> **New applications start in `PENDING_APPROVAL`.** An Evantra administrator
> must approve the client before it can complete an OAuth flow. You do not
> need to register it twice — the workspace tells you the status at the
> moment you create it.

Then register your redirect URI — the exact URL Evantra sends the user back
to. The shape depends on your platform:

| Platform             | Redirect URI                             |
| -------------------- | ---------------------------------------- |
| Web                  | `https://app.example.com/oauth/callback` |
| iOS / Android / Expo | `com.example.app://oauth/callback`       |
| Desktop / CLI        | `http://127.0.0.1:53682/callback`        |

The redirect URI must match **exactly**, including scheme, host, port and
trailing slash. A mismatch is the most common cause of an `invalid_request`
at the authorize step.

---

## 4. Part 1 — Web, in three steps

### Step 1: wrap your app

```tsx
import {
  EvantraIdentityProvider,
  EvantraSignInButton,
  EvantraRegisterButton,
} from "@evantra-identity/react";

export function AuthButtons() {
  return (
    <EvantraIdentityProvider
      config={{
        identityWebBaseUrl: "https://identity.evantradebuckman.com",
        identityApiBaseUrl: "https://evantra-headquarters.onrender.com",
        clientId: "evt_client_…",
      }}
    >
      <EvantraSignInButton returnTo="/welcome">
        Sign in with Evantra
      </EvantraSignInButton>

      <EvantraRegisterButton returnTo="/welcome">
        Create account
      </EvantraRegisterButton>
    </EvantraIdentityProvider>
  );
}
```

`returnTo` must be a **same-origin relative path** on the identity
application. Absolute URLs are rejected, so the identity app can never be
used as an open redirect.

### Step 2: start the flow

```ts
import {
  createEvantraAuthorizeUrl,
  createEvantraPkcePair,
  createEvantraState,
  defaultIdentityApiBaseUrl,
} from "@evantra-identity/react";

const { verifier, challenge } = await createEvantraPkcePair();
const state = createEvantraState();

// Verifier goes in sessionStorage — never localStorage.
sessionStorage.setItem("evantra_pkce_verifier", verifier);
sessionStorage.setItem("evantra_oauth_state", state);

window.location.assign(
  createEvantraAuthorizeUrl(defaultIdentityApiBaseUrl(), {
    clientId: "evt_client_…",
    redirectUri: "https://app.example.com/oauth/callback",
    codeChallenge: challenge,
    state,
  }),
);
```

**Why the authorize URL points at the identity API host.** `/oauth/authorize`
is the API's authorization endpoint. If the visitor has no session, the API
redirects them to the identity web app to sign in (and register, and verify
their email), then completes the request and returns the code to your
`redirectUri`. Pointing at the web app directly would skip the endpoint that
issues the code.

### Step 3: finish on your callback page

```ts
import {
  consumeEvantraWebCallback,
  exchangeEvantraCode,
} from "@evantra-identity/react";

const { code } = consumeEvantraWebCallback(state);

const tokens = await exchangeEvantraCode(
  { clientId: "evt_client_…" },
  {
    code,
    codeVerifier: sessionStorage.getItem("evantra_pkce_verifier")!,
    redirectUri: "https://app.example.com/oauth/callback",
  },
);
```

`consumeEvantraWebCallback` also strips the code from the address bar so it
is not bookmarked or shared. It throws `invalid_state` if the returned
`state` does not match the one you stored.

---

## 5. Part 2 — Mobile (React Native / Expo)

Same flow, three differences: store secrets in `SecureStore` instead of
`sessionStorage`, open the URL in an auth session, and read the code from
the deep link.

```ts
import {
  consumeEvantraNativeCallback,
  exchangeEvantraCode,
  createEvantraAuthorizeUrl,
  createEvantraPkcePair,
  createEvantraState,
  defaultIdentityApiBaseUrl,
} from "@evantra-identity/react";

const REDIRECT_URI = "com.example.app://oauth/callback";

const { verifier, challenge } = await createEvantraPkcePair();
const state = createEvantraState();

await SecureStore.setItemAsync("evantra_pkce_verifier", verifier);
await SecureStore.setItemAsync("evantra_oauth_state", state);

const result = await WebBrowser.openAuthSessionAsync(
  createEvantraAuthorizeUrl(defaultIdentityApiBaseUrl(), {
    clientId: "evt_client_…",
    redirectUri: REDIRECT_URI,
    codeChallenge: challenge,
    state,
  }),
  REDIRECT_URI,
);

const { code } = consumeEvantraNativeCallback(result.url!, state);

const tokens = await exchangeEvantraCode(
  { clientId: "evt_client_…" },
  {
    code,
    codeVerifier: (await SecureStore.getItemAsync("evantra_pkce_verifier"))!,
    redirectUri: REDIRECT_URI,
  },
);
```

---

## 6. Part 3 — Backend, desktop and CLI

`@evantra-identity/sdk` gives you the same flow without browser assumptions,
plus `completeAuthorization()` which exchanges the code and loads the
profile in one call.

```ts
import {
  EvantraOAuthClient,
  createEvantraPkcePair,
  createEvantraState,
  parseEvantraCallback,
} from "@evantra-identity/sdk";

const client = new EvantraOAuthClient({
  clientId: "evt_client_…",
  redirectUri: "https://api.example.com/oauth/callback",
  scope: "openid profile email",
  // clientSecret: "…"  // confidential clients only
});

const { verifier, challenge } = await createEvantraPkcePair();
const state = createEvantraState();

const authorizeUrl = client.createAuthorizeUrl({
  codeChallenge: challenge,
  state,
});

// Send the user's browser to authorizeUrl.

// On your callback route:
const { code } = parseEvantraCallback(requestUrl, state);

const { tokens, profile } = await client.completeAuthorization({
  code,
  codeVerifier: verifier,
});
```

`EvantraOAuthClient` methods: `createAuthorizeUrl()`, `exchangeCode()`,
`refresh()`, `revoke()`, `getUserInfo()`, `completeAuthorization()`.

---

## 7. Part 4 — Read the profile

```ts
console.log(profile.sub); // stable user identifier
console.log(profile.evantra_id); // Evantra ID
console.log(profile.email);
console.log(profile.email_verified); // ALWAYS check this before trusting
```

Requested scopes:

| Scope     | Grants                            |
| --------- | --------------------------------- |
| `openid`  | ID token identifying the user     |
| `profile` | Name and Evantra ID               |
| `email`   | Contact email and verified status |

Default scope is `openid profile email`. Check `email_verified` before
trusting an address.

---

## 8. Part 5 — Handle errors

```ts
import { EvantraOAuthError } from "@evantra-identity/react";

try {
  await exchangeEvantraCode({ clientId }, { code, codeVerifier, redirectUri });
} catch (error) {
  if (error instanceof EvantraOAuthError) {
    switch (error.error) {
      case "invalid_grant": // code expired or reused
      case "invalid_state": // possible CSRF
        return restartSignIn();

      case "access_denied": // user declined
        return redirectHome();
    }
  }

  throw error;
}
```

Common error values: `access_denied`, `invalid_state`, `invalid_grant`,
`invalid_client`, `invalid_scope`, `token_exchange_failed`.

---

## 9. Security checklist

Do these and you are safe:

1. **Always use PKCE (S256).** The SDK does this for you — do not disable it.
2. **Never embed a `client_secret` in a browser or mobile app.** Those are
   public clients and must rely on PKCE alone.
3. **Always send `state` and verify it on return.** The callback helpers
   throw `invalid_state` if it does not match.
4. **Store the PKCE verifier in `sessionStorage` (web) or
   `SecureStore`/keystore (native)** — never `localStorage`.
5. **Exchange the code on your backend** when your client is confidential.
6. **Use a random loopback port and bind to `127.0.0.1` only.**
7. **Verify the `id_token` yourself before trusting its claims.** The SDK
   does not verify ID token signatures — that needs the JWKS and is left to
   the caller. Use a dedicated library (`jose`, `openid-client`) and
   validate `iss`, `aud`, `exp` and `nonce`. Treat the token as untrusted
   until then.
8. **Check `email_verified`** before treating an address as trustworthy.

---

## 10. Full API reference

### Components (`@evantra-identity/react`)

| Export                    | Purpose                              |
| ------------------------- | ------------------------------------ |
| `EvantraIdentityProvider` | Supplies configuration via context   |
| `useEvantraIdentity()`    | Reads the current configuration      |
| `EvantraSignInButton`     | Link to the hosted sign-in page      |
| `EvantraRegisterButton`   | Link to the hosted registration page |
| `EvantraAuthorizeButton`  | Link to `/oauth/authorize`           |

### OAuth core (both packages)

| Export                           | Purpose                             |
| -------------------------------- | ----------------------------------- |
| `createEvantraPkcePair()`        | PKCE verifier + S256 challenge      |
| `createEvantraState()`           | Unguessable CSRF state value        |
| `createEvantraAuthorizeUrl()`    | Builds the authorize URL            |
| `createEvantraLoginUrl()`        | Hosted sign-in URL                  |
| `createEvantraRegisterUrl()`     | Hosted registration URL             |
| `defaultIdentityApiBaseUrl()`    | The identity API origin             |
| `defaultIdentityWebBaseUrl()`    | The identity web origin             |
| `consumeEvantraWebCallback()`    | Reads the code from the browser URL |
| `consumeEvantraNativeCallback()` | Reads the code from a deep link     |
| `exchangeEvantraCode()`          | Code → tokens                       |
| `refreshEvantraToken()`          | Refresh token → tokens              |
| `revokeEvantraToken()`           | Revokes a token                     |
| `fetchEvantraUserInfo()`         | Loads the user profile              |
| `EVANTRA_DEFAULT_SCOPE`          | `"openid profile email"`            |
| `EvantraOAuthError`              | Typed OAuth failure                 |

`refreshEvantraToken()` and `revokeEvantraToken()` take the config object
first, then the token: `refreshEvantraToken({ clientId }, refreshToken)`.

### Server SDK only (`@evantra-identity/sdk`)

| Export                   | Purpose                                  |
| ------------------------ | ---------------------------------------- |
| `EvantraOAuthClient`     | Full client for servers, desktop and CLI |
| `parseEvantraCallback()` | Parses an authorization response         |
| `EVANTRA_DEFAULT_SCOPE`  | `"openid profile email"`                 |
| Workspace types          | Burden, Promise Graph, Life-Work Plan    |

---

## 11. Where to go next

- [Client Integration Guide](https://github.com/Debuck1718/evantradebuckman/blob/main/evantra/docs/identity-client-integration.md) —
  the full walkthrough, including the registration and email-verification
  round-trip, token refresh and logout.
- [Distribution Guide](https://github.com/Debuck1718/evantradebuckman/blob/main/evantra/docs/distribution.md) —
  every install channel and how to migrate to npm later.
- [SDK README](https://github.com/Debuck1718/evantradebuckman/blob/main/evantra/packages/sdk/README.md)
- [React README](https://github.com/Debuck1718/evantradebuckman/blob/main/evantra/packages/identity-react/README.md)

---

## Why the tarball and not npm

npm publishing is blocked until the account's two-factor authentication flow
is completed. The tarballs are the exact same code that will appear on the
registry — same package names, same version 0.1.0, same import paths.

When the npm release lands, migration is one line per dependency and zero
code changes:

```bash
npm uninstall @evantra-identity/sdk @evantra-identity/react
npm install @evantra-identity/sdk @evantra-identity/react
```

Import statements stay identical because the package names are unchanged.

---

## Assets in this release

- `evantra-identity-sdk-0.1.0.tgz`
- `evantra-identity-react-0.1.0.tgz`

**Full Changelog:** https://github.com/Debuck1718/evantradebuckman/commits/identity-v0.1.0
