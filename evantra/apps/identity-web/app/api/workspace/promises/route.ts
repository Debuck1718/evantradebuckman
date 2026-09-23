import { NextRequest, NextResponse } from "next/server";

import {
  createPromise,
  dueSoonPromises,
  type WorkspacePromise,
} from "../../../workspace/lib/intelligence";

import {
  requireAuthenticatedAccount,
  workspaceErrorResponse,
} from "../_store";
import {
  createWorkspacePromise,
  listPromises,
  updatePromiseStatus,
} from "../repository";
import { promisePatchSchema } from "../validation";
import { promiseCreateSchema } from "../validation";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const items = await listPromises(accountId);

    return NextResponse.json({
      items,
      dueSoon: dueSoonPromises(items),
    });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to load promises.");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const parsed = promiseCreateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid promise request." }, { status: 400 });
    const payload = parsed.data;

    const accountId = await requireAuthenticatedAccount(request);

    const item = createPromise(payload.title, payload.dueAt);

    const created = await createWorkspacePromise(accountId, item);
    const items = await listPromises(accountId);

    return NextResponse.json(
      {
        item: created,
        items,
        dueSoon: dueSoonPromises(items),
      },
      { status: 201 },
    );
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to create promise.");
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const parsed = promisePatchSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid promise request." }, { status: 400 });
    const payload = parsed.data;

    const accountId = await requireAuthenticatedAccount(request);

    await updatePromiseStatus(accountId, payload.id, payload.status);
    const items = await listPromises(accountId);

    return NextResponse.json({
      items,
      dueSoon: dueSoonPromises(items),
    });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to update promise.");
  }
}
