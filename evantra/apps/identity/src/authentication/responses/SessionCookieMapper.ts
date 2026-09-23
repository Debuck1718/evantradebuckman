import {
  BrowserSession,
} from "../../session";

import {
  HttpCookie,
} from "../../http";

const SESSION_COOKIE_NAME =
  "evantra_session_id";

function secureCookie(): boolean {
  return process.env.NODE_ENV === "production";
}

function sameSitePolicy(): "lax" | "none" {
  return secureCookie() ? "none" : "lax";
}

/**
 * Optional cookie domain.
 *
 * Evantra Identity is reached through a
 * first-party proxy at
 * identity.evantradebuckman.com while the
 * service itself runs on a separate host.
 *
 * A host-only cookie issued by the
 * upstream host is not replayed by the
 * browser on the proxied origin, which
 * leaves the visitor pinned to a stale
 * session identifier and produces a
 * permanent "sign in required" state.
 *
 * Setting SESSION_COOKIE_DOMAIN to the
 * public origin (for example
 * ".evantradebuckman.com") scopes the
 * cookie to the site the user is
 * actually browsing so the freshly issued
 * session is honoured.
 *
 * When the variable is unset the cookie
 * stays host-only, which remains correct
 * for direct-to-service deployments.
 */
function cookieDomain(): string | undefined {
  const configured =
    process.env.SESSION_COOKIE_DOMAIN?.trim();

  return configured ? configured : undefined;
}

export class SessionCookieMapper {

  static active(
    browserSession: BrowserSession,
  ): HttpCookie {
    const domain = cookieDomain();

    return {
      name: SESSION_COOKIE_NAME,
      value:
        browserSession.identity.sessionId,
      httpOnly: true,
      secure: secureCookie(),
      sameSite: sameSitePolicy(),
      path: "/",
      ...(domain ? { domain } : {}),
      expiresAt:
        browserSession.lifecycle.getExpiresAt(),
    };
  }

  static clear(): HttpCookie {
    const domain = cookieDomain();

    return {
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: secureCookie(),
      sameSite: sameSitePolicy(),
      path: "/",
      ...(domain ? { domain } : {}),
      expiresAt: new Date(0),
    };
  }

}
