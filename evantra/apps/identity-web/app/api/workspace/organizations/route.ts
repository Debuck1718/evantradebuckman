import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedAccount } from "../_store";
import { createOrganization, listOrganizationsFor } from "../_support_orgs";
import { organizationCreateSchema } from "../_support_validation";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const organizations = await listOrganizationsFor(accountId);
    return NextResponse.json({ organizations });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? 401 : 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load organizations." },
      { status },
    );
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
    const status = error instanceof Error && "status" in error ? 401 : 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create the organization." },
      { status },
    );
  }
}
