import { NextRequest, NextResponse } from "next/server";

import { DatabaseConfigError } from "./_database";


const IDENTITY_API_URL = (
  process.env.IDENTITY_API_URL ??
  process.env.NEXT_PUBLIC_IDENTITY_API_URL ??
  "https://evantra-headquarters.onrender.com"
).replace(/\/$/, "");

export class WorkspaceAuthError extends Error {
  readonly status = 401;
}


function isAuthError(error: unknown): boolean {
  return (
    error instanceof WorkspaceAuthError ||
    (typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: unknown }).status === 401)
  );
}


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


  if (error instanceof DatabaseConfigError) {
    console.error("[workspace]", error.message);

    return NextResponse.json(
      {
        error:
          "Workspace storage is not configured. " +
          "Set DATABASE_URL (or IDENTITY_DATABASE_URL) to the Evantra Identity " +
          "database in identity-web's environment and redeploy.",
      },
      { status: 503 },
    );
  }


  const message =
    error instanceof Error ? error.message : fallbackMessage;

  
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
