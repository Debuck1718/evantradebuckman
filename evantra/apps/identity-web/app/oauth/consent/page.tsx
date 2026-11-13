import Link from "next/link";
import { headers } from "next/headers";

import { IdentityConsentShell } from "../../../components/identity/IdentityConsentShell";
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

interface ClientDisplayInfo {
  name: string;
  homepageUrl: string | null;
  description: string | null;
}

const IDENTITY_API_URL = (
  process.env.IDENTITY_API_URL ??
  process.env.NEXT_PUBLIC_IDENTITY_API_URL ??
  "https://evantra-headquarters.onrender.com"
).replace(/\/$/, "");

async function getClientDisplayInfo(
  clientId: string | undefined,
): Promise<ClientDisplayInfo | null> {
  if (!clientId) return null;

  try {
    const requestHeaders = await headers();
    const forwardedHost = requestHeaders.get("x-forwarded-host");
    const host = forwardedHost ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${protocol}://${host}` : IDENTITY_API_URL;
    const response = await fetch(
      `${baseUrl}/api/backend/clients/${encodeURIComponent(clientId)}/display-info`,
      { cache: "no-store" },
    );

    if (!response.ok) return null;

    const result = (await response.json()) as {
      client?: ClientDisplayInfo;
    };

    return result.client ?? null;
  } catch {
    return null;
  }
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

  const clientId = readParam(resolvedSearchParams.client_id);
  const client = await getClientDisplayInfo(clientId);
  const clientName = client?.name ?? "External application";

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
    <IdentityConsentShell>
      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Requested by
          </p>
          <h3 className="mt-2 break-words text-xl font-semibold text-white sm:text-2xl">
            {clientName}
          </h3>
          {client?.homepageUrl ? (
            <a
              href={client.homepageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block max-w-full truncate text-sm text-[#fae59a] hover:underline"
            >
              {new URL(client.homepageUrl).hostname}
            </a>
          ) : null}
          {client?.description ? (
            <p className="mt-2 text-sm leading-5 text-white/60">
              {client.description}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-5 text-white/60">
            This application is requesting access to:
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Access requested
          </p>

          {scopes.length > 0 ? (
            <div className="mt-3 grid gap-2">
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
                  <p className="mt-1 text-sm leading-5 text-white/60">
                    {item.definition.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-5 text-white/50">
              This request did not name any scopes, so the application will
              receive only your authenticated identity.
            </p>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <a
            href={backendAuthorizeUrl}
            className="inline-flex items-center justify-center rounded-xl bg-[#e6b24a] px-5 py-3.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
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

        <p className="text-center text-xs leading-5 text-white/40">
          You can review or revoke this access later in your account settings.
        </p>
      </div>
    </IdentityConsentShell>
  );
}
