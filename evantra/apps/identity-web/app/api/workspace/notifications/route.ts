import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedAccount, workspaceErrorResponse } from "../_store";
import {
  countUnreadNotifications,
  listNotifications,
  markNotificationsRead,
} from "../_support_orgs";
import { notificationsReadSchema } from "../_support_validation";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const [notifications, unread] = await Promise.all([
      listNotifications(accountId),
      countUnreadNotifications(accountId),
    ]);
    return NextResponse.json({ notifications, unread });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to load notifications.");
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
