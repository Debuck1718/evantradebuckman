import { NextRequest, NextResponse } from "next/server";

import {
  assessBurden,
  type BurdenSnapshot,
} from "../../../workspace/lib/intelligence";

import {
  requireAccountId,
  workspaceState,
} from "../_store";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = requireAccountId(request.nextUrl.searchParams.get("accountId"));
    const state = workspaceState(accountId);

    return NextResponse.json({
      snapshot: state.burden,
      assessment: assessBurden(state.burden),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load burden data." },
      { status: 400 },
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = (await request.json()) as {
      accountId?: string;
      snapshot?: BurdenSnapshot;
    };

    const accountId = requireAccountId(payload.accountId ?? null);

    if (!payload.snapshot) {
      return NextResponse.json({ error: "snapshot is required." }, { status: 400 });
    }

    const state = workspaceState(accountId);
    state.burden = {
      openTasks: Number(payload.snapshot.openTasks ?? 0),
      blockedTasks: Number(payload.snapshot.blockedTasks ?? 0),
      overdueTasks: Number(payload.snapshot.overdueTasks ?? 0),
      meetingsMinutesToday: Number(payload.snapshot.meetingsMinutesToday ?? 0),
      focusMinutesToday: Number(payload.snapshot.focusMinutesToday ?? 0),
      recoveryMinutesToday: Number(payload.snapshot.recoveryMinutesToday ?? 0),
      commitmentsDueSoon: Number(payload.snapshot.commitmentsDueSoon ?? 0),
    };

    return NextResponse.json({
      snapshot: state.burden,
      assessment: assessBurden(state.burden),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save burden data." },
      { status: 400 },
    );
  }
}
