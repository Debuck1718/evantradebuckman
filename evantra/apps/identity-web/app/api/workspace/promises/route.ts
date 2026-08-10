import { NextRequest, NextResponse } from "next/server";

import {
  createPromise,
  dueSoonPromises,
  type WorkspacePromise,
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
      items: state.promises,
      dueSoon: dueSoonPromises(state.promises),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load promises." },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = (await request.json()) as {
      accountId?: string;
      title?: string;
      dueAt?: string;
    };

    const accountId = requireAccountId(payload.accountId ?? null);

    if (!payload.title?.trim()) {
      return NextResponse.json({ error: "title is required." }, { status: 400 });
    }

    if (!payload.dueAt?.trim()) {
      return NextResponse.json({ error: "dueAt is required." }, { status: 400 });
    }

    const item = createPromise(payload.title, payload.dueAt);

    const state = workspaceState(accountId);
    state.promises = [item, ...state.promises];

    return NextResponse.json(
      {
        item,
        items: state.promises,
        dueSoon: dueSoonPromises(state.promises),
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create promise." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = (await request.json()) as {
      accountId?: string;
      id?: string;
      status?: WorkspacePromise["status"];
    };

    const accountId = requireAccountId(payload.accountId ?? null);

    if (!payload.id?.trim()) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    if (!payload.status) {
      return NextResponse.json({ error: "status is required." }, { status: 400 });
    }

    const state = workspaceState(accountId);

    state.promises = state.promises.map(item =>
      item.id === payload.id
        ? {
            ...item,
            status: payload.status!,
          }
        : item,
    );

    return NextResponse.json({
      items: state.promises,
      dueSoon: dueSoonPromises(state.promises),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update promise." },
      { status: 400 },
    );
  }
}
