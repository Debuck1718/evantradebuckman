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

export class SessionCookieMapper {

  static active(
    browserSession: BrowserSession,
  ): HttpCookie {
    return {
      name: SESSION_COOKIE_NAME,
      value:
        browserSession.identity.sessionId,
      httpOnly: true,
      secure: secureCookie(),
      sameSite: sameSitePolicy(),
      path: "/",
      expiresAt:
        browserSession.lifecycle.getExpiresAt(),
    };
  }

  static clear(): HttpCookie {
    return {
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: secureCookie(),
      sameSite: sameSitePolicy(),
      path: "/",
      expiresAt: new Date(0),
    };
  }

}
