import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedAccount } from "../_store";
import { createWorkspaceEvent, listWorkspaceEvents } from "../repository";
import { calendarRequestSchema } from "../validation";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const events = await listWorkspaceEvents(accountId);
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load calendar." },
      { status: error instanceof Error && "status" in error ? 401 : 400 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const parsed = calendarRequestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid calendar request." }, { status: 400 });
    const payload = parsed.data;

    const event = await createWorkspaceEvent(accountId, {
      title: payload.title,
      description: payload.description,
      startAt: payload.startAt,
      endAt: payload.endAt,
      focusBlock: payload.focusBlock ?? false,
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to schedule event." },
      { status: error instanceof Error && "status" in error ? 401 : 400 },
    );
  }
}
