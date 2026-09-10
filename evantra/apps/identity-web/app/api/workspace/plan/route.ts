import { NextRequest, NextResponse } from "next/server";

import {
  buildLifeWorkPlan,
} from "../../../workspace/lib/intelligence";

import {
  requireAuthenticatedAccount,
} from "../_store";
import { getBurden, listPromises } from "../repository";

const sampleTopTasks = [
  "Clear one blocker that impacts delivery",
  "Finish integration plan for Evantra Identity",
  "Protect a 90-minute deep-work session",
  "Close two overdue or stalled tasks",
  "Publish daily update to your team",
];

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const burden = await getBurden(accountId);
    const promises = await listPromises(accountId);

    const plan = buildLifeWorkPlan({
      burden,
      promises,
      topTasks: sampleTopTasks,
      upcomingEventsCount: 4,
    });

    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load plan." },
      { status: error instanceof Error && "status" in error ? 401 : 400 },
    );
  }
}
