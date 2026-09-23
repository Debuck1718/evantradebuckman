import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedAccount, workspaceErrorResponse } from "../_store";
import { createOrganization, listOrganizationsFor } from "../_support_orgs";
import { organizationCreateSchema } from "../_support_validation";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const organizations = await listOrganizationsFor(accountId);
    return NextResponse.json({ organizations });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to load organizations.");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const parsed = organizationCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid organization request." }, { status: 400 });
    }

    const accountId = await requireAuthenticatedAccount(request);
    const created = await createOrganization(accountId, parsed.data);

    return NextResponse.json({ organization: created }, { status: 201 });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to create the organization.");
  }
}
