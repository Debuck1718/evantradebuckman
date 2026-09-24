import Link from "next/link";

import { IdentityShell } from "../../../components/identity/IdentityShell";
import { DeveloperNav } from "../../../components/developer/DeveloperNav";
import { CodeBlock } from "../../../components/developer/CodeBlock";

const installReact = "pnpm add @evantra-identity/react";

const installSdk = "pnpm add @evantra-identity/sdk";

const webFlow = `import {
  createEvantraAuthorizeUrl,
  createEvantraPkcePair,
  createEvantraState,
} from "@evantra-identity/react";

// The authorize endpoint lives on the identity API host.
const API = "https://evantra-headquarters.onrender.com";
const REDIRECT_URI = "https://app.example.com/oauth/callback";

// 1. Create the PKCE verifier and a CSRF state value
const { verifier, challenge } = await createEvantraPkcePair();
const state = createEvantraState();

sessionStorage.setItem("evantra_pkce_verifier", verifier);
sessionStorage.setItem("evantra_oauth_state", state);

// 2. Send the user to the authorization endpoint
window.location.assign(
  createEvantraAuthorizeUrl(API, {
    clientId: "evt_client_...",
    redirectUri: REDIRECT_URI,
    codeChallenge: challenge,
    codeChallengeMethod: "S256",
    scope: "openid profile email",
    state,
  }),
);`;

const webCallback = `// app/oauth/callback/page.tsx
"use client";

import { useEffect } from "react";
import {
  consumeEvantraWebCallback,
  exchangeEvantraCode,
} from "@evantra-identity/react";

const REDIRECT_URI = "https://app.example.com/oauth/callback";

export default function Callback() {
  useEffect(() => {
    async function complete() {
      // Reads ?code= and strips it from the address bar
      const { code } = consumeEvantraWebCallback(
        sessionStorage.getItem("evantra_oauth_state"),
      );

      const tokens = await exchangeEvantraCode(
        { clientId: "evt_client_..." },
        {
          code,
          codeVerifier:
            sessionStorage.getItem("evantra_pkce_verifier") ?? "",
          redirectUri: REDIRECT_URI,
        },
      );

      // Hand the token to YOUR backend to start your own session
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: tokens.access_token }),
      });

      window.location.assign("/dashboard");
    }

    void complete();
  }, []);

  return <p>Completing sign in...</p>;
}`;

const reactButtons = `import {
  EvantraIdentityProvider,
  EvantraSignInButton,
  EvantraRegisterButton,
} from "@evantra-identity/react";

// returnTo is a same-origin path on the identity app,
// so the identity service can never be used as an
// open redirect.
export function LoginSection() {
  return (
    <EvantraIdentityProvider
      config={{
        identityWebBaseUrl: "https://identity.evantradebuckman.com",
        identityApiBaseUrl: "https://evantra-headquarters.onrender.com",
        clientId: "evt_client_...",
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
}`;

const mobileFlow = `import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import {
  createEvantraAuthorizeUrl,
  createEvantraPkcePair,
  createEvantraState,
  consumeEvantraNativeCallback,
  exchangeEvantraCode,
} from "@evantra-identity/react";

const API = "https://evantra-headquarters.onrender.com";
const REDIRECT_URI = "com.example.app://oauth/callback";
const CLIENT_ID = "evt_client_...";

// 1. PKCE + state, held in the OS keychain/keystore
const { verifier, challenge } = await createEvantraPkcePair();
const state = createEvantraState();

await SecureStore.setItemAsync("evantra_pkce_verifier", verifier);
await SecureStore.setItemAsync("evantra_oauth_state", state);

// 2. Open the system browser
const result = await WebBrowser.openAuthSessionAsync(
  createEvantraAuthorizeUrl(API, {
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    codeChallenge: challenge,
    state,
  }),
  REDIRECT_URI,
);

if (result.type !== "success" || !result.url) {
  throw new Error("Sign in was cancelled.");
}

// 3. Read the code from the deep link
const { code } = consumeEvantraNativeCallback(result.url, state);

const tokens = await exchangeEvantraCode(
  { clientId: CLIENT_ID },
  {
    code,
    codeVerifier:
      (await SecureStore.getItemAsync("evantra_pkce_verifier")) ?? "",
    redirectUri: REDIRECT_URI,
  },
);`;

const serverFlow = `import { EvantraOAuthClient, parseEvantraCallback } from "@evantra-identity/sdk";

const client = new EvantraOAuthClient({
  clientId: "evt_client_...",
  redirectUri: "https://api.example.com/oauth/callback",
  scope: "openid profile email",
  // clientSecret: "..."  // confidential clients only
});

// On your callback route
const { code } = parseEvantraCallback(requestUrl, savedState);

// Exchange AND load the profile in one call
const { tokens, profile } = await client.completeAuthorization({
  code,
  codeVerifier: savedVerifier,
});

console.log("Signed in as", profile.evantra_id);`;

const endpoints = [
  {
    method: "GET",
    path: "/oauth/authorize",
    description:
      "Starts the flow and, once consent is given, redirects back to your redirect_uri with a code.",
  },
  {
    method: "POST",
    path: "/oauth/token",
    description:
      "Exchanges an authorization code or refresh token for tokens.",
  },
  {
    method: "GET",
    path: "/oauth/userinfo",
    description:
      "Returns the OpenID Connect profile for a Bearer access token.",
  },
  {
    method: "POST",
    path: "/oauth/revoke",
    description: "Revokes an access or refresh token.",
  },
  {
    method: "POST",
    path: "/oauth/introspect",
    description:
      "Reports whether a token is active and what it may access.",
  },
];

const checklist = [
  "Register the OAuth client and its exact redirect URIs first.",
  "Use PKCE with S256 on every authorization request.",
  "Send state and verify it when the code returns.",
  "Keep client secrets server-side only — never in a browser or app binary.",
  "Exchange the single-use code promptly, and refresh tokens as needed.",
  "Check email_verified before trusting a contact address.",
  "Keep app-level authorization and role checks in your product.",
];

export default function IntegrationKitPage() {
  return (
    <IdentityShell
      title="Integration kit"
      description="Drop-in code for web, mobile and server integrations with Evantra Identity."
    >
      <div className="space-y-6">
        <DeveloperNav activeHref="/developers/integration-kit" />

        {/* Install */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Installation
          </p>

          <h3 className="mt-4 text-2xl font-semibold text-white">
            Add Evantra Identity to your app
          </h3>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Use the React package for web and mobile apps. Use the SDK for
            servers, desktop apps and CLI tools.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <CodeBlock
              label="Web · React / Next · React Native"
              code={installReact}
            />

            <CodeBlock
              label="Server · Desktop · CLI"
              code={installSdk}
            />
          </div>
        </section>

        {/* Web flow */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Web · start the flow
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            Authorization code with PKCE
          </h4>

          <div className="mt-5">
            <CodeBlock
              label="Start authorization"
              language="ts"
              code={webFlow}
            />
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Web · handle the callback
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            Exchange the code on your callback route
          </h4>

          <div className="mt-5">
            <CodeBlock
              label="Callback route"
              language="tsx"
              code={webCallback}
            />
          </div>
        </section>

        {/* Mobile */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Mobile · React Native / Expo
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            Deep-link redirect with secure verifier storage
          </h4>

          <p className="mt-3 text-sm leading-6 text-white/60">
            Register a reverse-DNS scheme such as{" "}
            <code className="mx-1 rounded bg-black/30 px-1.5 py-0.5 text-[11px] text-[#f5d48a]">
              com.example.app://oauth/callback
            </code>{" "}
            against your client before using this flow.
          </p>

          <div className="mt-5 grid gap-3">
            <CodeBlock
              label="Mobile authorization"
              language="ts"
              code={mobileFlow}
            />
          </div>
        </section>

        {/* Server */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Server / desktop / CLI
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            The SDK handles exchange and profile loading
          </h4>

          <div className="mt-5">
            <CodeBlock
              label="SDK client"
              language="ts"
              code={serverFlow}
            />
          </div>
        </section>

        {/* Buttons variant */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Optional · hosted sign-in buttons
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            Link straight to the hosted pages
          </h4>

          <p className="mt-3 text-sm leading-6 text-white/60">
            These buttons point at the hosted sign-in and registration
            pages. Use them for a simple integration, or use the OAuth flow
            above when you need your own token exchange.
          </p>

          <div className="mt-5">
            <CodeBlock
              label="React components"
              language="tsx"
              code={reactButtons}
            />
          </div>
        </section>

        {/* Endpoints */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Endpoints
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            Identity API surface
          </h4>

          <div className="mt-5 grid gap-3">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.path}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg border border-[#e6b24a]/30 bg-[#e6b24a]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f5d48a]">
                    {endpoint.method}
                  </span>

                  <code className="break-all font-mono text-sm text-white">
                    {endpoint.path}
                  </code>
                </div>

                <p className="mt-3 text-xs leading-6 text-white/50">
                  {endpoint.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 break-all text-xs leading-6 text-white/45">
            Base URL: https://evantra-headquarters.onrender.com
          </p>
        </section>

        {/* Checklist */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Integration checklist
          </p>

          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            {checklist.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e6b24a]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="rounded-xl bg-[#e6b24a] px-4 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
            >
              Read full documentation
            </Link>

            <Link
              href="/developers"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              Back to integration guide
            </Link>
          </div>
        </section>
      </div>
    </IdentityShell>
  );
}

