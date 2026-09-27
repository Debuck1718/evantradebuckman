import { NextResponse } from "next/server";

import {
  CANDIDATE_VARIABLES,
  getDatabaseUrl,
  getDatabaseUrlSource,
} from "../_database";

/*
 * Workspace storage diagnostics.
 *
 * The workspace routes answer 503 with
 * "Workspace storage is not configured" whenever the
 * identity-web process cannot resolve a usable
 * postgres URL. That message alone cannot tell an
 * operator whether the variable is missing, empty,
 * or set to something malformed — and the Render
 * dashboard only shows that the variable exists, not
 * what the running process read.
 *
 * This endpoint reports exactly what the live process
 * resolved, so the difference between "configured on
 * Render" and "visible at runtime" is observable.
 *
 * It never returns the connection string or the
 * password: only the source variable name and the
 * host, which is not a secret.
 */
export async function GET(): Promise<NextResponse> {
  const url = getDatabaseUrl();
  const source = getDatabaseUrlSource();

  const present = CANDIDATE_VARIABLES.filter(name => {
    const raw = process.env[name];

    return typeof raw === "string" && raw.trim().length > 0;
  });

  let host: string | undefined;
  let database: string | undefined;

  if (url) {
    try {
      const parsed = new URL(url);

      host = parsed.hostname;
      database = parsed.pathname.replace(/^\//, "") || undefined;
    } catch {
      host = undefined;
    }
  }

  return NextResponse.json(
    {
      configured: Boolean(url),
      source: source ?? null,
      host: host ?? null,
      database: database ?? null,
      /*
       * Which candidate variables the process can
       * see at all. A variable listed here but not
       * chosen as the source is present but did not
       * normalise into a postgres URL.
       */
      variablesPresent: present,
      expectedVariables: CANDIDATE_VARIABLES,
      runtime: process.env.NODE_ENV ?? "unknown",
      hint: url
        ? "Workspace storage is reachable. If routes still fail, check the server log for the pg error code."
        : present.length > 0
          ? "A candidate variable is set but is not a usable postgres:// or postgresql:// URL. Check for quotes, a trailing newline, or a pasted NAME= prefix."
          : "No candidate variable is visible to this process. Set DATABASE_URL on the identity-web service itself and redeploy.",
    },
    {
      status: url ? 200 : 503,
      headers: { "cache-control": "no-store" },
    },
  );
}