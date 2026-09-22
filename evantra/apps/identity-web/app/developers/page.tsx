import Link from "next/link";

import { IdentityShell } from "../../components/identity/IdentityShell";
import { DeveloperNav } from "../../components/developer/DeveloperNav";

/**
 * The end-to-end integration path.
 *
 * Written to match the actual implementation:
 * authorization code + PKCE, hosted sign-in
 * handled by Evantra Identity, and a returnTo
 * round-trip that survives registration and
 * email verification.
 */
const steps = [
  {
    title: "1. Register your OAuth client",
    description:
      "Create an application in the Evantra workspace. You receive a public client_id, and a client_secret only if your application is confidential.",
    detail:
      "Confidential clients run on a server. Web front ends, mobile apps and desktop apps are public clients and must never hold a secret.",
  },
  {
    title: "2. Register exact redirect URIs",
    description:
      "Redirect URIs are matched exactly. There are no wildcards and no prefix matching.",
    detail:
      "Web: https://app.example.com/oauth/callback  ·  Native: com.example.app://oauth/callback  ·  Loopback: http://127.0.0.1:PORT/callback",
  },
  {
    title: "3. Send the user to /oauth/authorize",
    description:
      "Point the browser or system web view at the authorization endpoint with your PKCE challenge and state.",
    detail:
      "If the visitor has no Evantra session, the identity service walks them through sign in — and registration and email verification when needed — then returns them to your exact authorize request.",
  },
  {
    title: "4. Exchange the code for tokens",
    description:
      "POST the authorization code and your PKCE verifier to /oauth/token, then load the profile from /oauth/userinfo.",
    detail:
      "Exchange the code on your backend when your client is confidential. The code is single-use and expires quickly.",
  },
  {
    title: "5. Manage the session lifecycle",
    description:
      "Use refresh, revoke and userinfo from your backend, and keep your own session aligned with Evantra's httpOnly cookie.",
    detail:
      "Revoke tokens on sign-out. Never persist an access token in localStorage.",
  },
];

const redirectTargets = [
  {
    target: "Web",
    uri: "https://app.example.com/oauth/callback",
    capture: "Your callback route reads ?code= from the URL.",
  },
  {
    target: "Native (iOS / Android / Expo)",
    uri: "com.example.app://oauth/callback",
    capture:
      "The OS opens a deep link into your app. Read the code from the incoming URL.",
  },
  {
    target: "Desktop / CLI (loopback)",
    uri: "http://127.0.0.1:53682/callback",
    capture:
      "A temporary local listener receives the code. Use a random port and bind to 127.0.0.1 only.",
  },
];

const checklist = [
  "Always use PKCE with the S256 challenge method.",
  "Always send state and verify it when the code comes back.",
  "Never embed a client_secret in a browser or mobile app.",
  "Exchange the authorization code before it expires — it is single use.",
  "Keep refresh tokens in secure storage or on your server.",
  "Check email_verified before trusting a contact address.",
  "Keep your own authorization and role checks in your application.",
];

export default function DevelopersPage() {
  return (
    <IdentityShell
      title="Developer integration"
      description="Integrate Evantra Identity into web, mobile and desktop applications using OAuth 2.0 with PKCE."
    >
      <div className="space-y-6">
        <DeveloperNav activeHref="/developers" />

        {/* Intro */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Integration path
          </p>

          <h3 className="mt-4 text-2xl font-semibold text-white">
            Keep identity simple. Keep authorization in your app.
          </h3>

          <p className="mt-4 text-sm leading-6 text-white/60">
            Evantra Identity provides authentication, consent and session
            management through the OAuth 2.0 Authorization Code flow with
            PKCE. Your application keeps ownership of its own permissions,
            teams and product-specific access logic.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Flow
              </p>

              <p className="mt-2 text-sm font-medium text-white/85">
                Authorization code + PKCE
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Standards
              </p>

              <p className="mt-2 text-sm font-medium text-white/85">
                RFC6749 · RFC7636 · RFC8252
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Redirect targets
              </p>

              <p className="mt-2 text-sm font-medium text-white/85">
                Web · Native · Loopback
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}

        <div className="grid gap-4">
          {steps.map((step) => (
            <section
              key={step.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6"
            >
              <h4 className="text-lg font-semibold text-white">
                {step.title}
              </h4>

              <p className="mt-3 text-sm leading-6 text-white/60">
                {step.description}
              </p>

              <p className="mt-3 rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-xs leading-6 text-white/45">
                {step.detail}
              </p>
            </section>
          ))}
        </div>

        {/* Redirect targets */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Redirect targets
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            Where the authorization code is delivered
          </h4>

          <div className="mt-5 grid gap-4">
            {redirectTargets.map((item) => (
              <div
                key={item.target}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">
                    {item.target}
                  </p>

                  <code className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] text-[#f5d48a]">
                    {item.uri}
                  </code>
                </div>

                <p className="mt-3 text-xs leading-6 text-white/50">
                  {item.capture}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-6 text-white/45">
            HTTPS is required for every non-loopback web URI. Plain http is
            accepted only on localhost, 127.0.0.1 or ::1. Fragments are
            rejected on all redirect URIs.
          </p>
        </section>

        {/* Registration and verification */}

        <section className="rounded-[1.5rem] border border-[#e6b24a]/25 bg-[#e6b24a]/[0.05] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Registration and email verification
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            You do not build a sign-up form.
          </h4>

          <p className="mt-4 text-sm leading-6 text-white/60">
            When a visitor with no Evantra ID reaches your authorization
            request, Evantra Identity handles registration, sends the
            verification email, and keeps your authorization request alive
            the whole time. After the contact email is confirmed the same
            request resumes and the authorization code is issued.
          </p>

          <p className="mt-3 text-sm leading-6 text-white/60">
            On mobile, the verification link opens in the user&apos;s mail
            browser rather than your app. Registering a loopback redirect
            URI lets you complete verification without depending on the
            mail client handing control back.
          </p>
        </section>

        {/* Best practices + support */}

        <div className="grid gap-4 sm:grid-cols-2">
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
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Submission and support
            </p>

            <p className="mt-4 text-sm leading-6 text-white/60">
              Share integration feedback, missing endpoints or workflow
              suggestions so Evantra workers can improve the identity
              platform.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/developers/integration-kit"
                className="rounded-xl bg-[#e6b24a] px-4 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
              >
                Integration kit
              </Link>

              <Link
                href="/developers/suggestions"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Submit feedback
              </Link>

              <Link
                href="/docs"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Read documentation
              </Link>
            </div>
          </section>
        </div>
      </div>
    </IdentityShell>
  );
}
