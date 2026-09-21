import { NextRequest } from "next/server";

const IDENTITY_API_URL =
  process.env.NEXT_PUBLIC_IDENTITY_API_URL ??
  "https://evantra-headquarters.onrender.com";

export class WorkspaceAuthError extends Error {
  readonly status = 401;
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
