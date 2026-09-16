import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedAccount } from "../../workspace/_store";
import {
  isPlatformOperator,
  listAllSupportRequests,
  resolveSupportRequest,
} from "../../workspace/_support_orgs";
import { supportResolveSchema } from "../../workspace/_support_validation";

/**
 * Lists every support request in
 * the platform. Accessible only
 * to members of the Evantra Team
 * organization.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);

    if (!(await isPlatformOperator(accountId))) {
      return NextResponse.json(
        { error: "Evantra Team membership is required." },
        { status: 403 },
      );
    }

    const requests = await listAllSupportRequests();
    return NextResponse.json({ requests });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? 401 : 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load support requests." },
      { status },
    );
  }
}

/**
 * Updates the status of a support
 * request (Evantra Team only).
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const parsed = supportResolveSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid update request." }, { status: 400 });
    }

    const accountId = await requireAuthenticatedAccount(request);

    if (!(await isPlatformOperator(accountId))) {
      return NextResponse.json(
        { error: "Evantra Team membership is required." },
        { status: 403 },
      );
    }

    await resolveSupportRequest(
      accountId,
      parsed.data.id,
      parsed.data.status,
      parsed.data.adminReply,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? 401 : 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update the request." },
      { status },
    );
  }
}
