"use client";

import { useEffect } from "react";
import Link from "next/link";

import { useIdentitySession } from "../../components/identity/IdentitySessionProvider";

/*
 * Resumes an interrupted authorization request.
 *
 * The identity API redirects a signed-in user
 * straight to /oauth/authorize on this origin, and
 * redirects an unauthenticated one to
 * /login?returnTo=/oauth/authorize?…
 *
 * This page used to render a static summary with a
 * "Sign in to continue" link, so a user who had
 * already signed in — and whose whole authorization
 * request was sitting in the query string — landed
 * on a dead end and had to start over. Nothing here
 * ever advanced the flow.
 *
 * The component reads the live session and moves the
 * request forward:
 *
 *   - signed in  -> /oauth/consent, which is where
 *                   the user actually approves access
 *   - signed out -> /login, preserving the entire
 *                   authorize request as returnTo
 *
 * The static summary stays on screen while this
 * resolves, so the page still works without
 * JavaScript and still explains what is being asked.
 */
export function AuthorizeAutoContinue({
  consentUrl,
  signInUrl,
}: {
  consentUrl: string;
  signInUrl: string;
}) {
  const { authenticated, loading } =
    useIdentitySession();

  useEffect(() => {
    /*
     * Wait for the session probe to settle before
     * deciding. Redirecting while loading would send
     * a signed-in user to /login.
     */
    if (loading) return;

    /*
     * replace() rather than push(): the user should
     * not be able to hit Back into a page that only
     * forwards them again.
     */
    window.location.replace(
      authenticated ? consentUrl : signInUrl,
    );
  }, [authenticated, consentUrl, loading, signInUrl]);

  /*
   * Nothing to render while the session is still
   * resolving: the redirect below takes over.
   */
  if (loading) {
    return null;
  }

  /*
   * The redirect is in flight. Render the manual
   * links as a fallback in case the navigation is
   * blocked (for example by a strict extension).
   */
  return (
    <p className="text-center text-xs text-white/40">
      Taking you to the next step…{" "}
      <Link
        href={authenticated ? consentUrl : signInUrl}
        className="text-[#e6b24a] transition hover:text-[#f0c15e]"
      >
        Continue manually
      </Link>
    </p>
  );
}