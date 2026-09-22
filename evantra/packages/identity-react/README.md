# @evantra/identity-react

React and React Native components, plus the OAuth 2.0 / PKCE core, for
Evantra Identity.

- **Web (React / Next.js)** — provider, buttons and URL helpers
- **Mobile (React Native / Expo)** — framework-agnostic core with
  deep-link handling
- **OAuth** — authorization code flow with PKCE (RFC6749, RFC7636,
  RFC8252)

> Full walkthrough: [Evantra Identity — Client Integration Guide](../../docs/identity-client-integration.md)

---

## Install

```bash
pnpm add @evantra/identity-react
```

---

## Quick start (web)

```tsx
import {
  EvantraIdentityProvider,
  EvantraSignInButton,
  EvantraRegisterButton,
} from "@evantra/identity-react";

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
application. Absolute URLs are rejected, so the identity app can never
be used as an open redirect.

---

## Full OAuth flow

```ts
import {
  createEvantraAuthorizeUrl,
  createEvantraPkcePair,
  createEvantraState,
  consumeEvantraWebCallback,
  exchangeEvantraCode,
} from "@evantra/identity-react";

// 1. Start
const { verifier, challenge } = await createEvantraPkcePair();
const state = createEvantraState();

sessionStorage.setItem("evantra_pkce_verifier", verifier);
sessionStorage.setItem("evantra_oauth_state", state);

window.location.assign(
  createEvantraAuthorizeUrl(
    "https://evantra-headquarters.onrender.com",
    {
      clientId: "evt_client_…",
      redirectUri: "https://app.example.com/oauth/callback",
      codeChallenge: challenge,
      state,
    },
  ),
);

// 2. On your callback page
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

`consumeEvantraWebCallback` also strips the code from the address bar so
it is not bookmarked or shared.

---

## Mobile (React Native / Expo)

```ts
import {
  consumeEvantraNativeCallback,
  exchangeEvantraCode,
  createEvantraAuthorizeUrl,
  createEvantraPkcePair,
  createEvantraState,
} from "@evantra/identity-react";

const REDIRECT_URI = "com.example.app://oauth/callback";

const { verifier, challenge } = await createEvantraPkcePair();
const state = createEvantraState();

await SecureStore.setItemAsync("evantra_pkce_verifier", verifier);
await SecureStore.setItemAsync("evantra_oauth_state", state);

const result = await WebBrowser.openAuthSessionAsync(
  createEvantraAuthorizeUrl(
    "https://evantra-headquarters.onrender.com",
    {
      clientId: "evt_client_…",
      redirectUri: REDIRECT_URI,
      codeChallenge: challenge,
      state,
    },
  ),
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

Registered redirect URI shapes:

| Platform | Redirect URI |
|---|---|
| Web | `https://app.example.com/oauth/callback` |
| iOS / Android / Expo | `com.example.app://oauth/callback` |
| Desktop / CLI | `http://127.0.0.1:PORT/callback` |

---

## Exports

### Components

| Export | Purpose |
|---|---|
| `EvantraIdentityProvider` | Supplies configuration via context |
| `useEvantraIdentity()` | Reads the current configuration |
| `EvantraSignInButton` | Link to the hosted sign-in page |
| `EvantraRegisterButton` | Link to the hosted registration page |
| `EvantraAuthorizeButton` | Link to `/oauth/authorize` |

### OAuth core

| Export | Purpose |
|---|---|
| `createEvantraPkcePair()` | PKCE verifier + S256 challenge |
| `createEvantraState()` | Unguessable CSRF state value |
| `createEvantraAuthorizeUrl()` | Builds the authorize URL |
| `createEvantraLoginUrl()` | Hosted sign-in URL |
| `createEvantraRegisterUrl()` | Hosted registration URL |
| `consumeEvantraWebCallback()` | Reads the code from the browser URL |
| `consumeEvantraNativeCallback()` | Reads the code from a deep link |
| `exchangeEvantraCode()` | Code → tokens |
| `refreshEvantraToken()` | Refresh token → tokens |
| `revokeEvantraToken()` | Revokes a token |
| `fetchEvantraUserInfo()` | Loads the user profile |
| `EvantraOAuthError` | Typed OAuth failure |

---

## Security notes

- Always use PKCE (`S256`).
- Never embed a `client_secret` in a browser or mobile app. Those are
  **public clients**.
- Always send `state` and verify it on return.
- Store the PKCE verifier in `sessionStorage` (web) or
  `SecureStore`/keystore (native) — never `localStorage`.
- Exchange the code on your backend when your client is confidential.
- Check `email_verified` before trusting an address.

See [Security checklist](../../docs/identity-client-integration.md#10-security-checklist).
