import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { IdentityShell } from "../../../components/identity/IdentityShell";

const IDENTITY_API_URL = (
  process.env.IDENTITY_API_URL ??
  process.env.NEXT_PUBLIC_IDENTITY_API_URL ??
  "https://evantra-headquarters.onrender.com"
).replace(/\/$/, "");

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
 * Reports whether the browser has a live Evantra session.
 *
 * This runs on the server so the decision to continue or
 * to sign in is made from the real cookie before any HTML
 * is sent. The previous client-side version raced the
 * session probe: it redirected to /login while the probe
 * was still resolving, which cancelled the in-flight
 * navigation and produced the
 * /oauth/authorize -> /login loop.
 *
 * A failure here is treated as "not signed in" rather than
 * an error: the visitor is then sent to sign in, which is
 * the correct recovery either way.
 */
async function hasActiveSession(): Promise<boolean> {
  const sessionId = (await cookies()).get("evantra_session_id")?.value?.trim();

  if (!sessionId) return false;

  try {
    const response = await fetch(`${IDENTITY_API_URL}/identity/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
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
    readParam(resolvedSearchParams.redirect_uri) ?? "/";

  /*
   * Resume the authorization request server-side.
   *
   * The identity API sends a signed-in user here to
   * finish the request, and an anonymous one to
   * /login?returnTo=/oauth/authorize?… . Because this
   * page is the landing point for both, it has to make
   * the decision itself.
   *
   * Doing it here — before any HTML is streamed — means
   * the browser receives a real HTTP redirect. The
   * earlier client-side version decided after hydration,
   * raced the session probe, and cancelled its own
   * navigation, which is what produced the
   * /oauth/authorize -> /login loop.
   *
   * An anonymous visitor goes to sign-in with the whole
   * request preserved, so nothing is lost. A signed-in
   * one goes straight to consent, which is the screen
   * that actually grants access and returns the code.
   */
  const signedIn = await hasActiveSession();

  if (signedIn) {
    redirect(consentUrl);
  }

  redirect(signInUrl);

  /*
   * redirect() throws, so this is only reached if the
   * framework ever stops doing that. It keeps the page
   * honest instead of rendering a blank screen: the
   * visitor can still move forward manually.
   */
  return (
    <IdentityShell
      title="Authorize application"
      description="Review the requested access and continue with your Evantra identity."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            OAuth request
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Authorize {clientName}
          </h3>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Redirect URI
            </p>
            <p className="mt-2 break-all text-sm text-white/70">
              {redirectUri ?? "Not provided"}
            </p>
          </div>
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
