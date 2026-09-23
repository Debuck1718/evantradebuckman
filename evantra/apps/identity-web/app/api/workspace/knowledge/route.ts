import { NextRequest, NextResponse } from "next/server";

import {
  requireAuthenticatedAccount,
  workspaceErrorResponse,
} from "../_store";
import {
  createKnowledgeItem,
  listKnowledgeItems,
  relateKnowledgeItems,
} from "../repository";
import { knowledgeRequestSchema } from "../validation";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const query = request.nextUrl.searchParams.get("q") ?? "";
    const items = await listKnowledgeItems(accountId, query);

    return NextResponse.json({ items });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to load knowledge.");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const parsed = knowledgeRequestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid knowledge request." }, { status: 400 });
    const payload = parsed.data;

    const item = await createKnowledgeItem(accountId, {
      title: payload.title,
      content: payload.content,
      type: payload.type,
      tags: [...new Set(payload.tags.map(tag => tag.toLowerCase()))],
    });

    if (payload.relatedId?.trim()) {
      await relateKnowledgeItems(accountId, item.id, payload.relatedId);
    }

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to save knowledge.");
  }
}
