import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedAccount, workspaceErrorResponse } from "../_store";
import {
  inviteByEvantraId,
  listPendingInvitesFor,
  respondToInvite,
} from "../_support_orgs";
import { inviteCreateSchema, inviteRespondSchema } from "../_support_validation";

/**
 * Pending invitations addressed to the
 * authenticated account (matched via
 * its evantra_id).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const invites = await listPendingInvitesFor(accountId);
    return NextResponse.json({ invites });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to load invitations.");
  }
}

/**
 * Two actions in one endpoint:
 *  - POST with organizationId + evantraId  → invite someone (admin action)
 *  - POST with inviteId + accept           → respond to own invitation
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const respond = inviteRespondSchema.safeParse(body);
    if (respond.success) {
      const accountId = await requireAuthenticatedAccount(request);
      await respondToInvite(accountId, respond.data.inviteId, respond.data.accept);
      return NextResponse.json({ ok: true });
    }

    const invite = inviteCreateSchema.safeParse(body);
    if (invite.success) {
      const accountId = await requireAuthenticatedAccount(request);
      const created = await inviteByEvantraId(
        invite.data.organizationId,
        accountId,
        invite.data.evantraId,
      );
      return NextResponse.json({ invite: created }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid invitation request." }, { status: 400 });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to process the invitation.");
  }
}
