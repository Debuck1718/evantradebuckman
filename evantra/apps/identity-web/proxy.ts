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

  const trimmed = value.trim().toLowerCase();

  if (trimmed.includes("://")) {
    try {
      return new URL(trimmed).hostname;
    } catch {
      return trimmed;
    }
  }

  return trimmed.split(":")[0];
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

  const [hostname, port] = destinationHost.split(":");
  url.hostname = hostname;
  url.port = port ?? "";

  return NextResponse.redirect(url, 307);
}

function redirectToPath(request: NextRequest, destinationPath: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = destinationPath;
  url.search = "";

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
  const workspaceRequest = isWorkspacePath(pathname);

  if (!allowRequest(pathname)) {
    if (APP_SURFACE === "workspace") {
      if (pathname === "/") {
        return redirectToPath(request, "/workspace/hub");
      }

      if (identityHost) {
        return redirectToHost(request, identityHost);
      }

      return redirectToPath(request, "/workspace/hub");
    }

    if (APP_SURFACE === "identity") {
      if (workspaceHost) {
        return redirectToHost(request, workspaceHost);
      }

      return redirectToPath(request, "/");
    }

    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  // Runtime host-based split, useful when APP_SURFACE is "all".
  if (APP_SURFACE === "all") {
    if (workspaceHost && host === workspaceHost && pathname === "/") {
      return redirectToPath(request, "/workspace/hub");
    }

    if (workspaceHost && host === workspaceHost && !workspaceRequest) {
      if (identityHost) {
        return redirectToHost(request, identityHost);
      }

      return redirectToPath(request, "/workspace/hub");
    }

    if (identityHost && host === identityHost && workspaceRequest) {
      if (workspaceHost) {
        return redirectToHost(request, workspaceHost);
      }

      return redirectToPath(request, "/");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
