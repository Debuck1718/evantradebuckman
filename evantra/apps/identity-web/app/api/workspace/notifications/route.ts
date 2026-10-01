import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedAccount, workspaceErrorResponse } from "../_store";
import {
  countUnreadNotifications,
  listNotifications,
  markNotificationsRead,
} from "../_support_orgs";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
} from "../_notifications";
import { notificationsReadSchema } from "../_support_validation";
import { notificationPreferencesSchema } from "../validation";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);

    const [notifications, unread, preferences] = await Promise.all([
      listNotifications(accountId),
      countUnreadNotifications(accountId),
      getNotificationPreferences(accountId),
    ]);

    return NextResponse.json({ notifications, unread, preferences });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to load notifications.");
  }
}

/**
 * Updates security-alert email preferences.
 *
 * The in-app record is written regardless of these flags — only the
 * email is optional, because the audit trail is not.
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);

    const parsed = notificationPreferencesSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid notification preferences." },
        { status: 400 },
      );
    }

    const preferences = await saveNotificationPreferences(accountId, parsed.data);

    return NextResponse.json({ preferences });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to save notification preferences.");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);

    let ids: string[] | undefined;
    if (request.headers.get("content-length") !== "0") {
      const parsed = notificationsReadSchema.safeParse(await request.json().catch(() => ({})));
      ids = parsed.success ? parsed.data.ids : undefined;
    }

    await markNotificationsRead(accountId, ids);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to update notifications.");
  }
}
