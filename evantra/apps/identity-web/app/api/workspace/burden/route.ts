import { NextRequest, NextResponse } from "next/server";

import {
  assessBurden,
  type BurdenSnapshot,
} from "../../../workspace/lib/intelligence";

import {
  requireAuthenticatedAccount,
} from "../_store";
import { getBurden, saveBurden } from "../repository";
import { burdenSchema } from "../validation";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const snapshot = await getBurden(accountId);

    return NextResponse.json({
      snapshot,
      assessment: assessBurden(snapshot),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load burden data." },
      { status: error instanceof Error && "status" in error ? 401 : 400 },
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const parsed = burdenSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid burden request." }, { status: 400 });
    const payload = parsed.data;

    const accountId = await requireAuthenticatedAccount(request);

    const snapshot = await saveBurden(accountId, {
      openTasks: Number(payload.snapshot.openTasks ?? 0),
      blockedTasks: Number(payload.snapshot.blockedTasks ?? 0),
      overdueTasks: Number(payload.snapshot.overdueTasks ?? 0),
      meetingsMinutesToday: Number(payload.snapshot.meetingsMinutesToday ?? 0),
      focusMinutesToday: Number(payload.snapshot.focusMinutesToday ?? 0),
      recoveryMinutesToday: Number(payload.snapshot.recoveryMinutesToday ?? 0),
      commitmentsDueSoon: Number(payload.snapshot.commitmentsDueSoon ?? 0),
    });

    return NextResponse.json({
      snapshot,
      assessment: assessBurden(snapshot),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save burden data." },
      { status: error instanceof Error && "status" in error ? 401 : 400 },
    );
  }
}
