import Link from "next/link";

import { IdentityShell } from "../../components/identity/IdentityShell";
import { DeveloperNav } from "../../components/developer/DeveloperNav";

const baseUrls = [
  {
    label: "Identity web application",
    value: "https://identity.evantradebuckman.com",
    note: "Sign in, registration, verification and consent screens.",
  },
  {
    label: "Identity API",
    value: "https://evantra-headquarters.onrender.com",
    note: "Authorization, token, userinfo, revoke and introspect endpoints.",
  },
];

const endpoints = [
  {
    method: "GET",
    path: "/oauth/authorize",
    request:
      "client_id, redirect_uri, response_type=code, code_challenge, code_challenge_method=S256, scope, state, nonce",
    response: "302 to redirect_uri with ?code= and ?state=",
  },
  {
    method: "POST",
    path: "/oauth/token",
    request:
      "grant_type=authorization_code, code, redirect_uri, client_id, code_verifier",
    response:
      "access_token, token_type, expires_in, refresh_token, id_token, scope",
  },
  {
    method: "POST",
    path: "/oauth/token (refresh)",
    request:
      "grant_type=refresh_token, refresh_token, client_id",
    response: "A new access_token and refresh_token",
  },
  {
    method: "GET",
    path: "/oauth/userinfo",
    request: "Authorization: Bearer <access_token>",
    response:
      "sub, evantra_id, email, email_verified, given_name, family_name, name",
  },
  {
    method: "POST",
    path: "/oauth/revoke",
    request: "token, client_id",
    response: "Empty body on success",
  },
  {
    method: "POST",
    path: "/oauth/introspect",
    request: "token, client_id",
    response: "active plus token metadata",
  },
];

const scopes = [
  {
    scope: "openid",
    grants: "An ID token that identifies the user.",
  },
  {
    scope: "profile",
    grants: "Name and Evantra ID claims.",
  },
  {
    scope: "email",
    grants:
      "Contact email together with its verification status.",
  },
];

const errors = [
  {
    code: "access_denied",
    meaning: "The user declined consent.",
    action: "Return them to your home page.",
  },
  {
    code: "invalid_state",
    meaning:
      "The returned state did not match the one you sent.",
    action: "Discard the code and restart the flow.",
  },
  {
    code: "invalid_grant",
    meaning:
      "The authorization code expired or was already used.",
    action: "Restart the flow.",
  },
  {
    code: "invalid_client",
    meaning: "client_id or client_secret was rejected.",
    action: "Check your client configuration.",
  },
  {
    code: "invalid_scope",
    meaning: "A requested scope is not permitted.",
    action: "Request only the scopes your client holds.",
  },
  {
    code: "invalid_request",
    meaning:
      "A required parameter was missing or malformed.",
    action: "Review the request against the endpoint table.",
  },
];

const rules = [
  "Use Evantra Identity only for lawful, authorized access.",
  "Register exact redirect URIs. There is no wildcard or prefix matching.",
  "Identity authenticates users. Your application owns its own authorization and role checks.",
  "Never store access tokens or session cookies in unsafe client storage.",
  "Keep client secrets on servers. Public clients rely on PKCE alone.",
  "Rotate client secrets on a schedule and immediately after any suspected exposure.",
  "Verify email_verified before treating a contact address as trusted.",
];

const strengths = [
  {
    title: "One identity everywhere",
    body: "A single Evantra ID authenticates users across first-party and approved partner applications.",
  },
  {
    title: "Standards-based",
    body: "OAuth 2.0 Authorization Code with PKCE (RFC6749, RFC7636), plus RFC8252 redirect handling for native apps.",
  },
  {
    title: "Hosted experience",
    body: "Sign in, registration, consent and email verification are handled for you, so you never build an auth form.",
  },
  {
    title: "Separated concerns",
    body: "Identity handles authentication and consent. Your product keeps its own permissions, teams and business rules.",
  },
  {
    title: "Controlled onboarding",
    body: "Clients and redirect URIs are explicitly registered, which limits where authorization codes can travel.",
  },
  {
    title: "Auditable",
    body: "Sign-in, consent and client onboarding events are recorded for review.",
  },
];

export default function DocsPage() {
  return (
    <IdentityShell
      title="Identity documentation"
      description="Technical reference for building on Evantra Identity: endpoints, scopes, errors and integration rules."
    >
      <div className="space-y-6">
        <DeveloperNav activeHref="/docs" />

        {/* Intro */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Reference
          </p>

          <h3 className="mt-4 text-2xl font-semibold text-white">
            Build with clarity, security, and explicit responsibility.
          </h3>

          <p className="mt-4 text-sm leading-6 text-white/60">
            Evantra Identity is the authentication layer. Your application
            remains responsible for authorization, permissions and
            business-specific access control.
          </p>

          <div className="mt-5 grid gap-3">
            {baseUrls.map((base) => (
              <div
                key={base.label}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {base.label}
                </p>

                <code className="mt-2 block break-all font-mono text-sm text-[#f5d48a]">
                  {base.value}
                </code>

                <p className="mt-2 text-xs leading-6 text-white/45">
                  {base.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Endpoints */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            API reference
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            Endpoints
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

                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                      Request
                    </dt>

                    <dd className="mt-2 break-words text-xs leading-6 text-white/60">
                      {endpoint.request}
                    </dd>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                      Returns
                    </dt>

                    <dd className="mt-2 break-words text-xs leading-6 text-white/60">
                      {endpoint.response}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* Scopes */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Scopes
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            Request only what you need
          </h4>

          <div className="mt-5 grid gap-3">
            {scopes.map((item) => (
              <div
                key={item.scope}
                className="flex flex-wrap items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <code className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-sm text-[#f5d48a]">
                  {item.scope}
                </code>

                <p className="min-w-0 flex-1 text-sm leading-6 text-white/60">
                  {item.grants}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-6 text-white/45">
            Scopes are space-separated. <code>openid profile email</code> is
            the default set and covers most integrations.
          </p>
        </section>

        {/* Errors */}

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Errors
          </p>

          <h4 className="mt-4 text-lg font-semibold text-white">
            OAuth error codes
          </h4>

          <div className="mt-5 grid gap-3">
            {errors.map((item) => (
              <div
                key={item.code}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <code className="rounded-lg border border-red-400/20 bg-red-400/10 px-2.5 py-1 font-mono text-xs text-red-200">
                  {item.code}
                </code>

                <p className="mt-3 text-sm leading-6 text-white/60">
                  {item.meaning}
                </p>

                <p className="mt-2 text-xs leading-6 text-[#f5d48a]/80">
                  {item.action}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Rules + strengths */}

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Rules and regulations
            </p>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
              {rules.map((rule) => (
                <li key={rule} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e6b24a]" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Why Evantra Identity
            </p>

            <div className="mt-4 grid gap-4">
              {strengths.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs leading-6 text-white/55">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Support */}

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Review channel
            </p>

            <p className="mt-4 text-sm leading-6 text-white/60">
              Feature requests, integration concerns and security
              suggestions can be submitted for Evantra workers to review.
            </p>

            <Link
              href="/developers/suggestions"
              className="mt-5 inline-flex rounded-xl bg-[#e6b24a] px-4 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
            >
              Submit a suggestion
            </Link>
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Integration code
            </p>

            <p className="mt-4 text-sm leading-6 text-white/60">
              Ready-to-use samples for web, mobile and server
              integrations, including the full PKCE and callback flow.
            </p>

            <Link
              href="/developers/integration-kit"
              className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              Open integration kit
            </Link>
          </section>
        </div>
      </div>
    </IdentityShell>
  );
}
