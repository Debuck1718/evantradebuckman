export function normalizeConfiguredHost(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const trimmed = value.trim().toLowerCase();

  if (trimmed.includes("://")) {
    try {
      return new URL(trimmed).hostname;
    } catch {
      return "";
    }
  }

  return trimmed.split(":")[0];
}

function buildOrigin(hostEnv: string | null | undefined): string | null {
  const host = normalizeConfiguredHost(hostEnv);

  if (!host) {
    return null;
  }

  return `https://${host}`;
}

export function buildIdentityUrl(pathname = "/"): string {
  const origin = buildOrigin(process.env.NEXT_PUBLIC_IDENTITY_HOST);

  return origin ? `${origin}${pathname}` : pathname;
}

export function buildWorkspaceUrl(pathname = "/workspace/account"): string {
  const origin = buildOrigin(process.env.NEXT_PUBLIC_WORKSPACE_HOST);

  return origin ? `${origin}${pathname}` : pathname;
}

export function buildIdentityLoginUrl(returnTo?: string): string {
  const loginUrl = buildIdentityUrl("/login");

  if (!returnTo) {
    return loginUrl;
  }

  if (loginUrl.startsWith("http://") || loginUrl.startsWith("https://")) {
    const url = new URL(loginUrl);
    url.searchParams.set("returnTo", returnTo);

    return url.toString();
  }

  const query = new URLSearchParams({ returnTo });
  return `${loginUrl}?${query.toString()}`;
}

export function isAllowedAbsoluteSurfaceUrl(value: string): boolean {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    const allowedHosts = [
      normalizeConfiguredHost(process.env.NEXT_PUBLIC_IDENTITY_HOST),
      normalizeConfiguredHost(process.env.NEXT_PUBLIC_WORKSPACE_HOST),
    ].filter(Boolean);

    return allowedHosts.includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}
