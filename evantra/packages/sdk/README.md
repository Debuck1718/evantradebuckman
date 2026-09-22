# @evantra/sdk

Server-side and native SDK for Evantra Identity and the Evantra
Workspace.

- **`EvantraOAuthClient`** — OAuth 2.0 Authorization Code flow with PKCE
- **Workspace types** — Burden, Promise Graph, Life-Work Plan

> Full walkthrough: [Evantra Identity — Client Integration Guide](../../docs/identity-client-integration.md)

---

## Install

```bash
pnpm add @evantra/sdk
```

---

## OAuth client

Use this from a **server**, a **desktop app**, a **CLI** or a
**confidential backend**. For browser and mobile apps, prefer
[`@evantra/identity-react`](../identity-react/README.md), which handles
redirects and secure storage for you.

```ts
import {
  EvantraOAuthClient,
  createEvantraPkcePair,
  createEvantraState,
  parseEvantraCallback,
} from "@evantra/sdk";

const client = new EvantraOAuthClient({
  clientId: "evt_client_…",
  redirectUri: "https://api.example.com/oauth/callback",
  scope: "openid profile email",
  // clientSecret: "…"  // confidential clients only
});

// 1. Start the flow
const { verifier, challenge } = await createEvantraPkcePair();
const state = createEvantraState();

const authorizeUrl = client.createAuthorizeUrl({
  codeChallenge: challenge,
  state,
});

// 2. Send the user's browser to authorizeUrl.
//    If they have no session, the identity service
//    walks them through sign in, registration and
//    email verification, then returns them here.

// 3. On your callback route
const { code } = parseEvantraCallback(requestUrl, state);

const { tokens, profile } = await client.completeAuthorization({
  code,
  codeVerifier: verifier,
});

console.log("Signed in as", profile.evantra_id);
```

### Redirect URI shapes

| Shape    | Example                                  | Use for           |
| -------- | ---------------------------------------- | ----------------- |
| Web      | `https://api.example.com/oauth/callback` | Servers, web apps |
| Native   | `com.example.app://oauth/callback`       | iOS, Android      |
| Loopback | `http://127.0.0.1:53682/callback`        | Desktop, CLI      |

---

## API

### `EvantraOAuthClient`

| Method                                          | Purpose                            |
| ----------------------------------------------- | ---------------------------------- |
| `createAuthorizeUrl(params)`                    | Builds the `/oauth/authorize` URL  |
| `exchangeCode({ code, codeVerifier })`          | Code → tokens                      |
| `refresh(refreshToken)`                         | Refresh token → tokens             |
| `revoke(token)`                                 | Revokes an access or refresh token |
| `getUserInfo(accessToken)`                      | Loads the OpenID Connect profile   |
| `completeAuthorization({ code, codeVerifier })` | Exchange **and** load the profile  |

### Helpers

| Export                                        | Purpose                                            |
| --------------------------------------------- | -------------------------------------------------- |
| `createEvantraPkcePair()`                     | PKCE verifier + S256 challenge                     |
| `createEvantraState()`                        | Unguessable CSRF state value                       |
| `parseEvantraCallback(query, expectedState?)` | Parses an authorization response                   |
| `EvantraOAuthError`                           | Typed OAuth failure (`error`, `message`, `status`) |
| `EVANTRA_DEFAULT_SCOPE`                       | `"openid profile email"`                           |

---

## Error handling

```ts
import { EvantraOAuthError } from "@evantra/sdk";

try {
  await client.completeAuthorization({ code, codeVerifier });
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

Common `error` values: `access_denied`, `invalid_state`,
`invalid_grant`, `invalid_client`, `invalid_scope`,
`token_exchange_failed`.

---

## Scopes

| Scope     | Grants                            |
| --------- | --------------------------------- |
| `openid`  | ID token identifying the user     |
| `profile` | Name and Evantra ID               |
| `email`   | Contact email and verified status |

Always check `email_verified` before trusting an address.

---

## Security notes

- Always use PKCE (`S256`).
- Only confidential clients may hold a `client_secret`. Server-side
  only — never in a browser, mobile app or desktop binary.
- Always send `state` and verify it on return.
- Use a **random loopback port** and bind to `127.0.0.1` only.
- Validate `iss` and `aud` on any ID token you consume.

See [Security checklist](../../docs/identity-client-integration.md#10-security-checklist).
