import Link from "next/link";

import { IdentityShell } from "../../../components/identity/IdentityShell";
import { AuthorizeAutoContinue } from "../../../components/identity/AuthorizeAutoContinue";
import { describeScopes } from "../../lib/oauth/scopes";

interface OAuthAuthorizePageProps {
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
 * percent-encoded.
 *
 * Next.js does not always decode search
 * params, so a redirect_uri such as
 * https%3A%2F%2Fapp.example.com%2Fcb would
 * otherwise render literally and read as
 * though no URI were present.
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

export default async function OAuthAuthorizePage({
  searchParams,
}: OAuthAuthorizePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const query = buildQuery(resolvedSearchParams);

  const scopes = describeScopes(
    resolvedSearchParams.scope ?? "",
  );

  const clientName =
    readParam(resolvedSearchParams.client_id) ??
    "External application";

  const redirectUri =
    readParam(resolvedSearchParams.redirect_uri);

  const signInUrl = `/login?returnTo=${encodeURIComponent(
    `/oauth/authorize${query ? `?${query}` : ""}`,
  )}`;

  const consentUrl = `/oauth/consent${query ? `?${query}` : ""}`;

  const cancelUrl =
    resolvedSearchParams.redirect_uri ?? "/";

  return (
    <IdentityShell
      title="Authorize application"
      description="Review the requested access and continue with your Evantra identity."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
                OAuth request
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                Authorize {clientName}
              </h3>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/60">
            This application is requesting permission to sign you in with your Evantra
            identity and access the requested account data.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Client
              </p>
              <p className="mt-2 text-sm text-white/80">
                {clientName}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Response type
              </p>
              <p className="mt-2 text-sm text-white/80">
                {resolvedSearchParams.response_type ?? "code"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Redirect URI
            </p>
            <p className="mt-2 break-all text-sm text-white/70">
              {redirectUri ?? "Not provided"}
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Requested scopes
          </p>

          {scopes.length > 0 ? (
            <div className="mt-5 space-y-4">
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
              No specific scopes were requested. This application will only
              receive your authenticated identity.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <Link
            href={signInUrl}
            className="inline-flex items-center justify-center rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
          >
            Sign in to continue
          </Link>

          <Link
            href={consentUrl}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
          >
            Review consent
          </Link>
        </div>

        <AuthorizeAutoContinue
          consentUrl={consentUrl}
          signInUrl={signInUrl}
        />

        <div className="text-sm text-white/40">
          <p>
            If you do not recognize this request, cancel and verify the requesting
            application before proceeding.
          </p>
          <p className="mt-2">
            <Link
              href={cancelUrl}
              className="text-[#e6b24a] transition hover:text-[#f0c15e]"
            >
              Cancel request
            </Link>
          </p>
        </div>
      </div>
    </IdentityShell>
  );
}
