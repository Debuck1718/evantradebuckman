import Link from "next/link";

import { IdentityShell } from "../../../components/identity/IdentityShell";
import { describeScopes, EVANTRA_DEFAULT_SCOPE } from "../../lib/oauth/scopes";

interface OAuthConsentPageProps {
  searchParams?: Promise<{
    client_id?: string;
    redirect_uri?: string;
    response_type?: string;
    scope?: string;
    state?: string;
    nonce?: string;
    code_challenge?: string;
    code_challenge_method?: string;
  }>;
}

function buildQuery(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query.set(key, value);
    }
  }

  return query.toString();
}

/**
 * Reads a query value that may arrive
 * percent-encoded, so a client_id or
 * redirect_uri is shown as the real value
 * rather than its escaped form.
 */
function readParam(
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;

  try {
    const decoded = decodeURIComponent(value);

    return decoded || undefined;
  } catch {
    return value;
  }
}

export default async function OAuthConsentPage({
  searchParams,
}: OAuthConsentPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  /*
   * RFC6749 makes `scope` optional; when it is
   * omitted the authorization endpoint grants the
   * client's registered default set. The consent
   * screen therefore shows that same default rather
   * than claiming nothing is being requested — a
   * consent prompt must never under-report what is
   * about to be granted.
   */
  const requestedScope =
    resolvedSearchParams.scope?.trim() ||
    EVANTRA_DEFAULT_SCOPE;

  const scopes = describeScopes(requestedScope);

  const clientName =
    readParam(resolvedSearchParams.client_id) ??
    "External application";

  const query = buildQuery(resolvedSearchParams);

  /*
   * Grant access must go through THIS app's own proxy,
   * not straight to the identity API host.
   *
   * The session cookie is issued on the public origin
   * (identity.evantradebuckman.com). The identity API
   * runs on a different registrable domain
   * (evantra-headquarters.onrender.com), so a browser
   * navigation to the API host never carries the
   * cookie. The API then sees an unauthenticated
   * request and bounces straight back to /login — the
   * exact "session does not stick" loop users hit.
   *
   * Routing through /api/backend/... makes the Next.js
   * route handler read the cookie server-side and
   * forward it as a Cookie header, which is how the
   * login and workspace calls already work.
   */
  const backendAuthorizeUrl = `/api/backend/oauth/authorize${
    query ? `?${query}` : ""
  }`;

  const denyUrl = (() => {
    const redirectUri =
      readParam(resolvedSearchParams.redirect_uri);

    if (!redirectUri) {
      return "/";
    }

    try {
      const url = new URL(redirectUri);

      url.searchParams.set(
        "error",
        "access_denied",
      );

      url.searchParams.set(
        "error_description",
        "The resource owner denied the request.",
      );

      if (resolvedSearchParams.state) {
        url.searchParams.set(
          "state",
          resolvedSearchParams.state,
        );
      }

      return url.toString();
    } catch {
      return "/";
    }
  })();

  return (
    <IdentityShell
      title="Application consent"
      description="Approve which identity data this application may access."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Requested by
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            {clientName}
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            This application needs your consent before it can access the data below.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Access requested
          </p>

          {scopes.length > 0 ? (
            <div className="mt-5 grid gap-4">
              {scopes.map((item) => (
                <div
                  key={item.scope}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">
                      {item.definition.title}
                    </p>
                    <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-[#fae59a]">
                      {item.scope}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {item.definition.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-white/50">
              This request did not name any scopes, so the application will
              receive only your authenticated identity.
            </p>
          )}        </div>

        <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <a
            href={backendAuthorizeUrl}
            className="inline-flex items-center justify-center rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
          >
            Grant access
          </a>

          <Link
            href={denyUrl}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
          >
            Deny access
          </Link>
        </div>

        <div className="text-sm text-white/40">
          <p>
            Consent is required so this application can use your Evantra identity safely.
          </p>
        </div>
      </div>
    </IdentityShell>
  );
}
