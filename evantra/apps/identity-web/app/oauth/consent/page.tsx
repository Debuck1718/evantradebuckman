import Link from "next/link";

import { IdentityShell } from "../../../components/identity/IdentityShell";
import { describeScopes } from "../../lib/oauth/scopes";

interface OAuthConsentPageProps {
  searchParams?: Promise<{
    client_id?: string;
    redirect_uri?: string;
    response_type?: string;
    scope?: string;
    state?: string;
    nonce?: string;
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

export default async function OAuthConsentPage({
  searchParams,
}: OAuthConsentPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const identityApiUrl =
    process.env.NEXT_PUBLIC_IDENTITY_API_URL ??
    "http://localhost:4000";

  const scopes = describeScopes(
    resolvedSearchParams.scope ?? "",
  );

  const clientName =
    resolvedSearchParams.client_id
      ? decodeURIComponent(resolvedSearchParams.client_id)
      : "External application";

  const query = buildQuery(resolvedSearchParams);
  const backendAuthorizeUrl = `${identityApiUrl}/oauth/authorize${
    query ? `?${query}` : ""
  }`;

  const denyUrl = (() => {
    const redirectUri =
      resolvedSearchParams.redirect_uri;

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
                  <p className="text-sm font-semibold text-white">
                    {item.definition.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {item.definition.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-white/50">
              This authorization request includes the default OpenID Connect scope.
            </p>
          )}
        </div>

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
