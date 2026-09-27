import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const IDENTITY_API_URL = (
  process.env.IDENTITY_API_URL ??
  process.env.NEXT_PUBLIC_IDENTITY_API_URL ??
  "https://evantra-headquarters.onrender.com"
).replace(/\/$/, "");

async function forward(request: NextRequest, path: string[]) {
  const target = `${IDENTITY_API_URL}/${path.join("/")}${request.nextUrl.search}`;
  const sessionCookie = (await cookies()).get("evantra_session_id")?.value;
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  if (sessionCookie) headers.set("cookie", `evantra_session_id=${sessionCookie}`);

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    cache: "no-store",
    /*
     * Do not follow redirects.
     *
     * The OAuth endpoints answer with 302s that carry
     * real meaning to the browser: /oauth/authorize
     * sends the visitor on to /login or back to the
     * client's redirect_uri with the authorization
     * code. Following them here would consume the
     * Location header server-side and hand the browser
     * only the final HTML, so the code would never
     * reach the client. Passing the 302 through keeps
     * the browser in charge of the navigation.
     */
    redirect: "manual",
  });

  /*
   * 3xx responses have no body to copy. Relay the
   * status and Location verbatim so the browser
   * performs the hop itself.
   */
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    const redirect = new NextResponse(null, { status: response.status });

    if (location) {
      /*
       * A redirect to the identity API's own host is
       * rewritten onto this public origin. The browser
       * cannot send the session cookie to the API host,
       * so a redirect that stays on onrender.com would
       * land the visitor on an unauthenticated page.
       */
      redirect.headers.set("location", rewriteApiLocation(location));
    }

    const redirectCookies =
      typeof response.headers.getSetCookie === "function"
        ? response.headers.getSetCookie()
        : [];

    for (const cookie of redirectCookies) {
      redirect.headers.append("set-cookie", stripForeignDomain(cookie));
    }

    return redirect;
  }

  const body = await response.arrayBuffer();
  const result = new NextResponse(body, { status: response.status });
  const contentType = response.headers.get("content-type");
  if (contentType) result.headers.set("content-type", contentType);


  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];

  for (const cookie of setCookies) {
    result.headers.append("set-cookie", stripForeignDomain(cookie));
  }

  return result;
}

/**
 * Keeps an upstream redirect on the origin the
 * browser is actually using.
 *
 * When the identity API redirects to its own host
 * (for example /oauth/authorize -> /login), the
 * browser would follow it to onrender.com, where
 * the session cookie does not exist. Rewriting the
 * origin onto this app routes the hop back through
 * the proxy so the cookie is forwarded again.
 */
function rewriteApiLocation(location: string): string {
  let upstream: URL;

  try {
    upstream = new URL(location);
  } catch {
    // Relative Location: already same-origin. Leave as-is.
    return location;
  }

  const apiHost = new URL(IDENTITY_API_URL).hostname.toLowerCase();

  if (upstream.hostname.toLowerCase() !== apiHost) {
    /*
     * A redirect to the client's own redirect_uri must
     * be preserved exactly: it is a different origin by
     * design and carries the authorization code.
     */
    return location;
  }

  return `${upstream.pathname}${upstream.search}`;
}

/**
 * Removes a Domain attribute that cannot
 * match the public origin serving this
 * request, so the browser keeps the
 * cookie on the site the visitor is on.
 */
function stripForeignDomain(cookie: string): string {
  const domainMatch = cookie.match(/;\s*Domain=([^;]+)/i);

  if (!domainMatch) return cookie;

  const domain = domainMatch[1].trim().toLowerCase();
  const upstreamHost = new URL(IDENTITY_API_URL).hostname.toLowerCase();

  /*
   * Only an upstream-specific domain is
   * unsafe. A shared parent domain such as
   * .evantradebuckman.com is intentional
   * and is preserved.
   */
  if (domain === upstreamHost) {
    return cookie.replace(/;\s*Domain=[^;]+/i, "");
  }

  return cookie;
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await context.params).path);
}
export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await context.params).path);
}
export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await context.params).path);
}
export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await context.params).path);
}
export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await context.params).path);
}
