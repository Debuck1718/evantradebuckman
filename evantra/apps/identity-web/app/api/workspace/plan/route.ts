import { NextRequest, NextResponse } from "next/server";

import {
  buildLifeWorkPlan,
} from "../../../workspace/lib/intelligence";

import {
  requireAccountId,
  workspaceState,
} from "../_store";

const sampleTopTasks = [
  "Clear one blocker that impacts delivery",
  "Finish integration plan for Evantra Identity",
  "Protect a 90-minute deep-work session",
  "Close two overdue or stalled tasks",
  "Publish daily update to your team",
];

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = requireAccountId(request.nextUrl.searchParams.get("accountId"));
    const state = workspaceState(accountId);

    const plan = buildLifeWorkPlan({
      burden: state.burden,
      promises: state.promises,
      topTasks: sampleTopTasks,
      upcomingEventsCount: 4,
    });

    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load plan." },
      { status: 400 },
    );
  }
}
