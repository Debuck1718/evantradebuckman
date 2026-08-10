import { NextRequest, NextResponse } from "next/server";

type SurfaceMode = "workspace" | "identity" | "all";

const APP_SURFACE =
  (process.env.EVANTRA_APP_SURFACE as SurfaceMode | undefined) ?? "all";

const WORKSPACE_PATH_PREFIXES = ["/workspace", "/api/workspace"];

const ALWAYS_PUBLIC_PREFIXES = [
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/images",
  "/icons",
  "/videos",
];

function normalizeHost(value: string | null): string {
  if (!value) {
    return "";
  }

  return value.toLowerCase().split(":")[0];
}

function hasPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isWorkspacePath(pathname: string): boolean {
  return hasPrefix(pathname, WORKSPACE_PATH_PREFIXES);
}

function isPublicAsset(pathname: string): boolean {
  return hasPrefix(pathname, ALWAYS_PUBLIC_PREFIXES);
}

function redirectToHost(request: NextRequest, destinationHost: string): NextResponse {
  const url = request.nextUrl.clone();
  url.host = destinationHost;

  return NextResponse.redirect(url, 307);
}

function allowRequest(pathname: string): boolean {
  if (isPublicAsset(pathname)) {
    return true;
  }

  if (APP_SURFACE === "workspace") {
    return isWorkspacePath(pathname);
  }

  if (APP_SURFACE === "identity") {
    return !isWorkspacePath(pathname);
  }

  return true;
}

export function proxy(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const host = normalizeHost(request.headers.get("host"));
  const workspaceHost = normalizeHost(process.env.NEXT_PUBLIC_WORKSPACE_HOST ?? null);
  const identityHost = normalizeHost(process.env.NEXT_PUBLIC_IDENTITY_HOST ?? null);

  if (!allowRequest(pathname)) {
    if (APP_SURFACE === "workspace" && identityHost) {
      return redirectToHost(request, identityHost);
    }

    if (APP_SURFACE === "identity" && workspaceHost) {
      return redirectToHost(request, workspaceHost);
    }

    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  const workspaceRequest = isWorkspacePath(pathname);

  // Runtime host-based split, useful when APP_SURFACE is "all".
  if (workspaceHost && host === workspaceHost && !workspaceRequest) {
    if (identityHost) {
      return redirectToHost(request, identityHost);
    }

    return NextResponse.redirect(new URL("/workspace/hub", request.url), 307);
  }

  if (identityHost && host === identityHost && workspaceRequest) {
    if (workspaceHost) {
      return redirectToHost(request, workspaceHost);
    }

    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
