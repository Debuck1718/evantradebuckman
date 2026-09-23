import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedAccount, workspaceErrorResponse } from "../_store";
import { askWorkspaceAssistant } from "../repository";
import { assistantRequestSchema } from "../validation";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const parsed = assistantRequestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid assistant request." }, { status: 400 });
    const result = await askWorkspaceAssistant(accountId, parsed.data.threadId, parsed.data.intent, parsed.data.question);
    return NextResponse.json(result);
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to query assistant.");
  }
}
