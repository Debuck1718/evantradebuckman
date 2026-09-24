# Evantra Identity — Client Integration Guide

Everything a client application needs to add **Sign in with Evantra** for
web, mobile and desktop, including the registration and email-verification
round-trip.

---

## Table of contents

1. [How the flow works](#1-how-the-flow-works)
2. [One-time setup](#2-one-time-setup)
3. [Web integration](#3-web-integration)
4. [Mobile integration](#4-mobile-integration)
5. [Desktop / CLI integration](#5-desktop--cli-integration)
6. [Registration and email verification](#6-registration-and-email-verification)
7. [Scopes and user data](#7-scopes-and-user-data)
8. [Tokens, refresh and logout](#8-tokens-refresh-and-logout)
9. [Error handling](#9-error-handling)
10. [Security checklist](#10-security-checklist)
11. [Environment reference](#11-environment-reference)

---

## 1. How the flow works

Evantra Identity implements **OAuth 2.0 Authorization Code flow with PKCE**
(RFC6749 + RFC7636). There is no implicit flow and no client-secret-only
flow.

```
 ┌──────────┐        ┌──────────────────┐        ┌─────────────────┐
 │  Your    │        │  Evantra Identity│        │  Evantra        │
 │  App     │        │  (web app)       │        │  Identity API   │
 └────┬─────┘        └────────┬─────────┘        └────────┬────────┘
      │                       │                           │
      │ 1. Generate PKCE      │                           │
      │    verifier+state     │                           │
      │                       │                           │
      │ 2. Redirect to /oauth/authorize ─────────────────►│
      │                       │                           │
      │                       │◄── 3. No session? ────────│
      │                       │       Redirect to /login  │
      │                       │       with returnTo       │
      │                       │                           │
      │◄── 4. User signs in, registers or verifies email ─│
      │                       │                           │
      │                       │ 5. returnTo resumes       │
      │                       │    /oauth/authorize ─────►│
      │                       │                           │
      │◄── 6. Redirect to your redirect_uri?code=... ─────│
      │                       │                           │
      │ 7. POST /oauth/token (code + verifier) ──────────►│
      │◄── 8. access_token, refresh_token, id_token ──────│
      │                       │                           │
      │ 9. GET /oauth/userinfo (Bearer) ─────────────────►│
      │◄── 10. Profile ───────────────────────────────────│
```

**Key point:** you never build a login form. Your app sends the user to
the identity service; the identity service handles sign-in, sign-up,
password rules and email verification, then returns the user to **your**
registered redirect URI with an authorization code.

---

## 2. One-time setup

### 2.1 Register an OAuth client

Create the client in the Evantra workspace under
**Applications → New application**. You receive:

| Value           | Example            | Notes                                                                 |
| --------------- | ------------------ | --------------------------------------------------------------------- |
| `client_id`     | `evt_client_9f2c…` | Public. Safe to embed.                                                |
| `client_secret` | `evt_secret_…`     | **Confidential clients only.** Never ship in a browser or mobile app. |

### 2.2 Register your redirect URIs

Every redirect URI must be registered **exactly** — Evantra does not do
prefix or wildcard matching. Three shapes are supported:

| Shape    | Example                                  | Use for                          |
| -------- | ---------------------------------------- | -------------------------------- |
| Web      | `https://app.example.com/oauth/callback` | Websites, Next.js apps           |
| Native   | `com.example.app://oauth/callback`       | iOS, Android, React Native, Expo |
| Loopback | `http://127.0.0.1:53682/callback`        | Desktop apps, CLI tools          |

**Rules enforced by the identity service:**

- HTTPS is required for all non-loopback web URIs.
- Plain `http://` is accepted **only** on `localhost`, `127.0.0.1` or `::1`.
- Custom schemes must be reverse-DNS (`com.example.app://…`), not bare
  schemes.
- Fragments (`#`) are rejected on every redirect URI.

### 2.3 Choose a redirect target

| Your app is…        | Target     | Where the code arrives                 |
| ------------------- | ---------- | -------------------------------------- |
| A website           | `web`      | Browser navigates to your callback URL |
| A mobile app        | `native`   | OS opens a deep link into your app     |
| A desktop app / CLI | `loopback` | Your local HTTP listener receives it   |

---

## 3. Web integration

### 3.1 Install

```bash
pnpm add @evantra-identity/react
```

### 3.2 Configure the provider

```tsx
// app/providers.tsx
"use client";

import { EvantraIdentityProvider } from "@evantra-identity/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EvantraIdentityProvider
      config={{
        identityWebBaseUrl: "https://identity.evantradebuckman.com",
        identityApiBaseUrl: "https://evantra-headquarters.onrender.com",
        clientId: "evt_client_9f2c…",
      }}
    >
      {children}
    </EvantraIdentityProvider>
  );
}
```

### 3.3 Start the authorization flow

```tsx
"use client";

import { useState } from "react";
import {
  createEvantraAuthorizeUrl,
  createEvantraPkcePair,
  createEvantraState,
  useEvantraIdentity,
} from "@evantra-identity/react";

export function SignInButton() {
  const config = useEvantraIdentity();
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);

    const { verifier, challenge } = await createEvantraPkcePair();
    const state = createEvantraState();

    /*
     * sessionStorage survives the redirect but
     * is cleared when the tab closes, which is
     * the right lifetime for a PKCE verifier.
     */
    sessionStorage.setItem("evantra_pkce_verifier", verifier);
    sessionStorage.setItem("evantra_oauth_state", state);

    window.location.assign(
      createEvantraAuthorizeUrl("https://evantra-headquarters.onrender.com", {
        clientId: config.clientId!,
        redirectUri: "https://app.example.com/oauth/callback",
        codeChallenge: challenge,
        scope: "openid profile email",
        state,
      }),
    );
  }

  return (
    <button onClick={signIn} disabled={busy}>
      {busy ? "Redirecting…" : "Sign in with Evantra"}
    </button>
  );
}
```

### 3.4 Handle the callback

```tsx
// app/oauth/callback/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  consumeEvantraWebCallback,
  exchangeEvantraCode,
} from "@evantra-identity/react";

export default function CallbackPage() {
  const [status, setStatus] = useState("Completing sign in…");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function complete() {
      try {
        const expectedState = sessionStorage.getItem("evantra_oauth_state");

        const { code } = consumeEvantraWebCallback(expectedState);

        const tokens = await exchangeEvantraCode(
          {
            clientId: "evt_client_9f2c…",
            /* No clientSecret: browser apps are public clients. */
          },
          {
            code,
            codeVerifier: sessionStorage.getItem("evantra_pkce_verifier") ?? "",
            redirectUri: "https://app.example.com/oauth/callback",
          },
        );

        sessionStorage.removeItem("evantra_pkce_verifier");
        sessionStorage.removeItem("evantra_oauth_state");

        /*
         * Send the tokens to YOUR backend to create
         * your own session cookie. Do not trust the
         * browser to hold them long-term.
         */
        await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokens.access_token }),
        });

        window.location.assign("/dashboard");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Sign in failed.");
      }
    }

    void complete();
  }, []);

  return <p>{status}</p>;
}
```

> **Do not store tokens in `localStorage`.** Route the code to your own
> backend and establish your own session there.

---

## 4. Mobile integration

Native apps are **public clients**: never embed a `client_secret`.

### 4.1 Register a deep link

**iOS — `Info.plist`**

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.example.app</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.example.app</string>
    </array>
  </dict>
</array>
```

**Android — `AndroidManifest.xml`**

```xml
<activity android:name=".OAuthCallbackActivity" android:exported="true">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.example.app" android:host="oauth" />
  </intent-filter>
</activity>
```

**Expo — `app.json`**

```json
{
  "expo": {
    "scheme": "com.example.app"
  }
}
```

Redirect URI in Evantra: `com.example.app://oauth/callback`

### 4.2 Start the flow (React Native / Expo)

```tsx
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import {
  createEvantraAuthorizeUrl,
  createEvantraPkcePair,
  createEvantraState,
  consumeEvantraNativeCallback,
  exchangeEvantraCode,
} from "@evantra-identity/react";

const REDIRECT_URI = "com.example.app://oauth/callback";
const CLIENT_ID = "evt_client_9f2c…";

export async function signInWithEvantra() {
  const { verifier, challenge } = await createEvantraPkcePair();
  const state = createEvantraState();

  /*
   * SecureStore maps to the iOS keychain and
   * Android keystore, so the verifier is not
   * readable by other apps.
   */
  await SecureStore.setItemAsync("evantra_pkce_verifier", verifier);
  await SecureStore.setItemAsync("evantra_oauth_state", state);

  const authorizeUrl = createEvantraAuthorizeUrl(
    "https://evantra-headquarters.onrender.com",
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      codeChallenge: challenge,
      scope: "openid profile email",
      state,
    },
  );

  /*
   * openAuthSessionAsync watches for the deep
   * link and returns it, so you do not need a
   * separate Linking listener for this step.
   */
  const result = await WebBrowser.openAuthSessionAsync(
    authorizeUrl,
    REDIRECT_URI,
  );

  if (result.type !== "success" || !result.url) {
    throw new Error("Sign in was cancelled.");
  }

  const expectedState = await SecureStore.getItemAsync("evantra_oauth_state");

  const { code } = consumeEvantraNativeCallback(result.url, expectedState);

  const verifierValue = await SecureStore.getItemAsync("evantra_pkce_verifier");

  const tokens = await exchangeEvantraCode(
    { clientId: CLIENT_ID },
    {
      code,
      codeVerifier: verifierValue ?? "",
      redirectUri: REDIRECT_URI,
    },
  );

  await SecureStore.deleteItemAsync("evantra_pkce_verifier");
  await SecureStore.deleteItemAsync("evantra_oauth_state");

  return tokens;
}
```

### 4.3 Cold-start deep links

If the OS launches your app directly from the email verification link or
a resumed authorization, handle the initial URL:

```tsx
useEffect(() => {
  async function handleInitialUrl() {
    const url = await Linking.getInitialURL();

    if (url?.startsWith(REDIRECT_URI)) {
      const expectedState = await SecureStore.getItemAsync(
        "evantra_oauth_state",
      );

      const { code } = consumeEvantraNativeCallback(url, expectedState);

      // …exchange as above
    }
  }

  void handleInitialUrl();
}, []);
```

### 4.4 Why the verification round-trip matters on mobile

When a mobile user registers, the verification email opens in their
**mail app's browser**, not your app. That is why the identity service
also accepts a **loopback** redirect (`http://127.0.0.1:PORT/callback`)
for native code capture — it lets you complete verification without
depending on the mail client handing control back to your app.

---

## 5. Desktop / CLI integration

Start a temporary listener on a loopback address, then point the system
browser at the authorize URL. **Use a random port** each run.

```ts
import { createServer } from "node:http";
import {
  EvantraOAuthClient,
  createEvantraPkcePair,
  createEvantraState,
  parseEvantraCallback,
} from "@evantra-identity/sdk";

const server = createServer();
server.listen(0, "127.0.0.1");

await new Promise<void>((resolve) => server.once("listening", resolve));

const { port } = server.address() as { port: number };
const redirectUri = `http://127.0.0.1:${port}/callback`;

const { verifier, challenge } = await createEvantraPkcePair();
const state = createEvantraState();

const client = new EvantraOAuthClient({
  clientId: "evt_client_9f2c…",
  redirectUri,
  scope: "openid profile email",
});

const authorizeUrl = client.createAuthorizeUrl({
  codeChallenge: challenge,
  state,
});

// open the system browser at authorizeUrl …

const code = await new Promise<string>((resolve, reject) => {
  server.on("request", (req, res) => {
    res.end("You can return to the application.");

    try {
      resolve(parseEvantraCallback(req.url ?? "", state).code);
    } catch (error) {
      reject(error);
    }
  });
});

const { tokens, profile } = await client.completeAuthorization({
  code,
  codeVerifier: verifier,
});

console.log("Signed in as", profile.evantra_id);
```

---

## 6. Registration and email verification

This is the part client applications most often get wrong, so it is
handled explicitly.

### 6.1 What happens

1. A user with no Evantra ID clicks **Sign in with Evantra**.
2. The identity service sees no session and redirects to `/login`,
   carrying the **entire** authorization request as `returnTo`.
3. The user taps **Create your Evantra ID**. The `returnTo` value
   follows them into registration.
4. On submit, the account is created with status
   **`PENDING_VERIFICATION`** and a verification email is sent.
5. The registration screen shows **“Pending verification”** and tells
   the user to open the email. It does **not** claim verification
   failed.
6. The user clicks the link in the email. That link carries their
   `returnTo` as well.
7. Verification succeeds, and the button continues to `returnTo` —
   which is `/oauth/authorize` again — so the authorization code is
   finally issued.
8. The user lands back on the client's redirect URI, signed in.

### 6.2 What you must do as a client

**Nothing extra.** You do not implement any of the above. It is
documented so you can explain the experience to your users and so you
recognise it in logs.

The one thing to verify: your redirect URI is registered, and your
callback handles the case where the user arrives **already
authenticated** (because the session cookie made step 6 resolve
instantly).

### 6.3 Using the hosted registration directly

If you want a **standalone** sign-up button rather than going through
OAuth:

```tsx
import { createEvantraRegisterUrl } from "@evantra-identity/react";

const url = createEvantraRegisterUrl(
  "https://identity.evantradebuckman.com",
  "/welcome", // where to go after the email is verified
);
```

The `returnTo` value is a **same-origin path** on the identity
application. Absolute URLs are rejected, which prevents an attacker from
turning the identity app into an open redirect. To return a user to
_your_ site, use the OAuth flow in section 3 instead.

---

## 7. Scopes and user data

| Scope     | Grants                                |
| --------- | ------------------------------------- |
| `openid`  | An ID token identifying the user      |
| `profile` | Name and Evantra ID                   |
| `email`   | Contact email and its verified status |

Scope strings are space-separated. `openid profile email` is the default
and what most clients need.

### UserInfo response

```json
{
  "sub": "acc_01H…",
  "evantra_id": "debuck@evantra",
  "email": "user@example.com",
  "email_verified": true,
  "given_name": "Evans",
  "family_name": "Buckman",
  "name": "Evans Buckman"
}
```

> Always check `email_verified` before trusting the address.

```ts
const profile = await client.getUserInfo(tokens.access_token);

if (!profile.email_verified) {
  // Prompt the user to confirm their email.
}
```

---

## 8. Tokens, refresh and logout

### 8.1 Token lifetime

| Token           | Lifetime | Storage                            |
| --------------- | -------- | ---------------------------------- |
| `access_token`  | 1 hour   | Memory, or your server session     |
| `refresh_token` | 30 days  | Server-side or secure storage only |
| `id_token`      | 1 hour   | Never persist                      |

### 8.2 Refreshing

```ts
const next = await client.refresh(oldRefreshToken);

// Replace the stored tokens
await saveTokens(next);
```

### 8.3 Logout

Revoke tokens, then end your own session:

```ts
await client.revoke(tokens.refresh_token ?? tokens.access_token);

await fetch("/api/session", { method: "DELETE" });

window.location.assign("/");
```

To sign the user out of Evantra itself as well, send them to
`https://identity.evantradebuckman.com/logout`.

---

## 9. Error handling

| `error`                 | Meaning                        | What to do                         |
| ----------------------- | ------------------------------ | ---------------------------------- |
| `access_denied`         | User declined consent          | Return them to your home page      |
| `invalid_state`         | State mismatch — possible CSRF | Discard the code, restart the flow |
| `invalid_grant`         | Code expired or already used   | Restart the flow                   |
| `invalid_client`        | Wrong `client_id`              | Check configuration                |
| `invalid_scope`         | Scope not permitted            | Request only granted scopes        |
| `token_exchange_failed` | Network or 5xx                 | Retry with backoff                 |

```ts
try {
  await client.completeAuthorization({ code, codeVerifier });
} catch (error) {
  if (error instanceof EvantraOAuthError) {
    switch (error.error) {
      case "access_denied":
        return router.push("/");
      case "invalid_grant":
      case "invalid_state":
        return restartSignIn();
    }
  }

  throw error;
}
```

---

## 10. Security checklist

- [ ] **Use PKCE** (`S256`) on every flow, without exception.
- [ ] **Never ship a `client_secret`** in a browser, mobile app or
      desktop binary.
- [ ] **Always send and verify `state`.**
- [ ] **Register exact redirect URIs** — no wildcards.
- [ ] **Exchange the code on your backend** for confidential clients.
- [ ] **Keep refresh tokens in secure storage** — keychain, keystore,
      or server-side.
- [ ] **Never put tokens in `localStorage`** for long-lived sessions.
- [ ] **Verify `email_verified`** before trusting an address.
- [ ] **Use a random loopback port** and bind to `127.0.0.1` only.
- [ ] **Validate the `iss` and `aud`** of any ID token you consume.

---

## 11. Environment reference

| Variable                       | Used by      | Default                                     |
| ------------------------------ | ------------ | ------------------------------------------- |
| `EVANTRA_IDENTITY_WEB_URL`     | Identity API | `http://localhost:3001`                     |
| `NEXT_PUBLIC_IDENTITY_API_URL` | Client apps  | `https://evantra-headquarters.onrender.com` |

**Production values**

```
Evantra Identity web:  https://identity.evantradebuckman.com
Evantra Identity API:  https://evantra-headquarters.onrender.com
Authorize endpoint:    GET  /oauth/authorize
Token endpoint:        POST /oauth/token
UserInfo endpoint:     GET  /oauth/userinfo
Revoke endpoint:       POST /oauth/revoke
Introspect endpoint:   POST /oauth/introspect
```

---

## Quick reference

```ts
// 1. Create PKCE + state
const { verifier, challenge } = await createEvantraPkcePair();
const state = createEvantraState();

// 2. Store verifier + state
sessionStorage.setItem("evantra_pkce_verifier", verifier);
sessionStorage.setItem("evantra_oauth_state", state);

// 3. Redirect
window.location.assign(
  createEvantraAuthorizeUrl(apiBaseUrl, {
    clientId,
    redirectUri,
    codeChallenge: challenge,
    state,
  }),
);

// 4. On callback
const { code } = consumeEvantraWebCallback(state);
const { tokens, profile } = await client.completeAuthorization({
  code,
  codeVerifier: sessionStorage.getItem("evantra_pkce_verifier")!,
});
```

That is the whole integration. Registration, sign-in, email
verification and the return trip are handled by Evantra Identity.
