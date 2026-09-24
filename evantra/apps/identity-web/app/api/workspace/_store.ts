import { NextRequest, NextResponse } from "next/server";

import { DatabaseConfigError } from "./_database";

/**
 * Base URL of Evantra Identity.
 *
 * IDENTITY_API_URL is the same variable the
 * /api/backend proxy uses, so every caller
 * resolves the service the same way. The
 * NEXT_PUBLIC_ variable is kept as a fallback
 * for existing deployments.
 */
const IDENTITY_API_URL = (
  process.env.IDENTITY_API_URL ??
  process.env.NEXT_PUBLIC_IDENTITY_API_URL ??
  "https://evantra-headquarters.onrender.com"
).replace(/\/$/, "");

export class WorkspaceAuthError extends Error {
  readonly status = 401;
}

/**
 * True when an error came from authentication
 * rather than from bad input.
 *
 * "status" in error is not reliable on its own:
 * it is true for any object carrying that key,
 * and false for errors that were serialised or
 * rebuilt. Checking the class first keeps the
 * 401 signal exact so a genuine database
 * failure is never reported as "signed out".
 */
function isAuthError(error: unknown): boolean {
  return (
    error instanceof WorkspaceAuthError ||
    (typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: unknown }).status === 401)
  );
}

/**
 * Converts a failed workspace request into a
 * response.
 *
 * A brand-new account is a normal, valid
 * state and must never surface as an error:
 * empty workspaces return empty payloads.
 * Only authentication failures become 401 and
 * only unexpected faults become 500.
 */
export function workspaceErrorResponse(
  error: unknown,
  fallbackMessage: string,
): NextResponse {
  if (isAuthError(error)) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An authenticated session is required.",
      },
      { status: 401 },
    );
  }

  /*
   * A missing database configuration is an
   * operator problem, not a transient fault,
   * and every workspace route would report the
   * same blank 500. Name it as a 503 with an
   * actionable message so the cause is visible
   * instead of being hidden behind a generic
   * "could not complete this request".
   */
  if (error instanceof DatabaseConfigError) {
    console.error("[workspace]", error.message);

    return NextResponse.json(
      {
        error:
          "Workspace storage is not configured. " +
          "Set DATABASE_URL in identity-web's environment and redeploy.",
      },
      { status: 503 },
    );
  }

  /*
   * A missing schema object (for example a
   * workspace that has not been provisioned)
   * is an internal condition, not bad input.
   * 500 keeps it distinguishable from a
   * request the client can fix.
   */
  const message =
    error instanceof Error ? error.message : fallbackMessage;

  /*
   * Content Security Policy and the browser
   * console both surface 500s, so the message
   * stays generic while the server logs detail.
   */
  console.error("[workspace]", message);

  return NextResponse.json(
    { error: "The workspace could not complete this request." },
    { status: 500 },
  );
}

export async function requireAuthenticatedAccount(
  request: NextRequest,
): Promise<string> {
  const sessionId = request.cookies.get("evantra_session_id")?.value?.trim();

  if (!sessionId) {
    throw new WorkspaceAuthError("An authenticated session is required.");
  }

  const response = await fetch(`${IDENTITY_API_URL}/identity/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new WorkspaceAuthError("Your session is invalid or expired.");
  }

  const payload = (await response.json()) as {
    account?: { id?: string };
  };
  const accountId = payload.account?.id?.trim();

  if (!accountId) {
    throw new WorkspaceAuthError("The authenticated account was not found.");
  }

  return accountId;
}
