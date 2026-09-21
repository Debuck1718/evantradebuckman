import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedAccount } from "../_store";
import { createSupportRequest, listSupportRequestsFor } from "../_support_orgs";
import { supportCreateSchema } from "../_support_validation";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const requests = await listSupportRequestsFor(accountId);
    return NextResponse.json({ requests });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? 401 : 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load support requests." },
      { status },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const parsed = supportCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid support request." }, { status: 400 });
    }

    const accountId = await requireAuthenticatedAccount(request);
    const created = await createSupportRequest(accountId, parsed.data);

    return NextResponse.json({ request: created }, { status: 201 });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? 401 : 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit the support request." },
      { status },
    );
  }
}
