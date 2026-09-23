import { NextRequest, NextResponse } from "next/server";

import { requireAuthenticatedAccount, workspaceErrorResponse } from "../_store";
import { createFinanceEntry, listFinanceEntries } from "../repository";
import { financeRequestSchema } from "../validation";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const entries = await listFinanceEntries(accountId);
    const income = entries.filter(item => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
    const expenses = entries.filter(item => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
    const byCategory = entries.reduce<Record<string, number>>((result, item) => {
      result[item.category] = (result[item.category] ?? 0) + (item.type === "income" ? item.amount : -item.amount);
      return result;
    }, {});
    return NextResponse.json({ entries, overview: { income, expenses, balance: income - expenses, byCategory } });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to load finance.");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const parsed = financeRequestSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid finance request." }, { status: 400 });
    const payload = parsed.data;
    const entry = await createFinanceEntry(accountId, {
      type: payload.type,
      amount: payload.amount,
      currency: payload.currency,
      category: payload.category,
      note: payload.note,
    });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to save finance entry.");
  }
}
