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

  /*
   * Forward every Set-Cookie header from
   * the identity service verbatim.
   *
   * Rebuilding the cookie here used to
   * force sameSite: "lax", which broke
   * the session on cross-site and
   * hardening the value ourselves also
   * risked drifting from the backend's
   * own expiry. Passing the header
   * straight through keeps HttpOnly,
   * Secure, SameSite and Expires exactly
   * as Evantra Identity issued them.
   */
  const setCookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];

  for (const cookie of setCookies) {
    result.headers.append("set-cookie", cookie);
  }

  return result;
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
