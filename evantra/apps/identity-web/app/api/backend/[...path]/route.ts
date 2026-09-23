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
  });
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
