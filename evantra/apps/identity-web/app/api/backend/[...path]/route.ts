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

  const setCookie = response.headers.get("set-cookie");
  const sessionMatch = setCookie?.match(/evantra_session_id=([^;]+)/);
  if (sessionMatch?.[1]) {
    result.cookies.set("evantra_session_id", sessionMatch[1], {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (request.method === "POST" && path.at(-1) === "logout") {
    result.cookies.set("evantra_session_id", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
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
