import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedAccount } from "../../workspace/_store";
import {
  isPlatformOperator,
  listInboundEmails,
  markInboundEmailRead,
} from "../../workspace/_support_orgs";


export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);

    if (!(await isPlatformOperator(accountId))) {
      return NextResponse.json(
        { error: "Evantra Team membership is required." },
        { status: 403 },
      );
    }

    const emails = await listInboundEmails();
    return NextResponse.json({ emails });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? 401 : 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load inbound emails." },
      { status },
    );
  }
}


export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { id?: unknown };

    if (typeof body.id !== "string" || body.id.length === 0) {
      return NextResponse.json({ error: "A valid email id is required." }, { status: 400 });
    }

    const accountId = await requireAuthenticatedAccount(request);

    if (!(await isPlatformOperator(accountId))) {
      return NextResponse.json(
        { error: "Evantra Team membership is required." },
        { status: 403 },
      );
    }

    await markInboundEmailRead(body.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? 401 : 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update the email." },
      { status },
    );
  }
}
