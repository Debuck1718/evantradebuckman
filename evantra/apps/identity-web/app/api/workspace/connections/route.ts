import { NextRequest, NextResponse } from "next/server";

import {
  requireAuthenticatedAccount,
  workspaceErrorResponse,
} from "../_store";
import {
  getAccountContact,
  listConnectedApplications,
  listConnectedSessions,
  listSecurityEvents,
  revokeApplicationAccess,
  revokeSession,
} from "../connections";

/*
 * Connected applications, devices and security activity.
 *
 * GET    /api/workspace/connections            everything in one payload
 * DELETE /api/workspace/connections?clientId=  revoke an app's access
 * DELETE /api/workspace/connections?sessionId= revoke one device
 *
 * Both revoke paths are scoped to the authenticated account inside
 * the repository, so a guessed id cannot affect another account.
 */

/**
 * Absolute base URL for links inside notification emails.
 *
 * Prefers the configured workspace host, then the request origin, so
 * a mail sent from a preview deployment still links somewhere real.
 */
function publicAppUrl(request: NextRequest): string | undefined {
  const configured = process.env.NEXT_PUBLIC_WORKSPACE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const host = process.env.NEXT_PUBLIC_WORKSPACE_HOST?.trim();
  if (host) {
    return host.startsWith("http") ? host.replace(/\/$/, "") : `https://${host}`;
  }

  try {
    return new URL(request.url).origin;
  } catch {
    return undefined;
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);

    // The caller's own session id, so the UI can mark "this device"
    // and refuse to let it revoke itself.
    const currentSessionId =
      request.cookies.get("evantra_session_id")?.value?.trim() || undefined;

    const [applications, sessions, events] = await Promise.all([
      listConnectedApplications(accountId),
      listConnectedSessions(accountId, currentSessionId),
      listSecurityEvents(accountId),
    ]);

    return NextResponse.json({ applications, sessions, events });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to load connections.");
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);

    const clientId = request.nextUrl.searchParams.get("clientId")?.trim();
    const sessionId = request.nextUrl.searchParams.get("sessionId")?.trim();

    if (!clientId && !sessionId) {
      return NextResponse.json(
        { error: "A clientId or sessionId is required." },
        { status: 400 },
      );
    }

    if (clientId) {
      const [contact, applications] = await Promise.all([
        getAccountContact(accountId),
        listConnectedApplications(accountId),
      ]);

      const app = applications.find((item) => item.clientId === clientId);

      const result = await revokeApplicationAccess(accountId, clientId, {
        clientName: app?.name,
        notify: contact?.email
          ? { to: contact.email, firstName: contact.firstName ?? undefined }
          : undefined,
        appUrl: publicAppUrl(request),
      });

      return NextResponse.json({
        revoked: "application",
        clientId,
        ...result,
      });
    }

    const currentSessionId =
      request.cookies.get("evantra_session_id")?.value?.trim() || undefined;

    const [contact, sessions] = await Promise.all([
      getAccountContact(accountId),
      listConnectedSessions(accountId),
    ]);

    const device = sessions.find((item) => item.id === sessionId);

    const removed = await revokeSession(
      accountId,
      sessionId!,
      currentSessionId,
      {
        deviceName: device?.deviceName,
        notify: contact?.email
          ? { to: contact.email, firstName: contact.firstName ?? undefined }
          : undefined,
        appUrl: publicAppUrl(request),
      },
    );

    if (!removed) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    return NextResponse.json({ revoked: "session", sessionId });
  } catch (error) {
    // revokeSession throws a plain Error for the self-revoke guard;
    // surface that as a 400 rather than a generic 500.
    if (
      error instanceof Error &&
      error.message.includes("currently using")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return workspaceErrorResponse(error, "Unable to revoke access.");
  }
}