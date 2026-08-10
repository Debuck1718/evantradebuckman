import { describe, expect, it } from "vitest";

import { FinanceWorkspace } from "../index";

describe("FinanceWorkspace", () => {
  it("computes scoped overview and savings", () => {
    const finance = new FinanceWorkspace();

    finance.recordEntry({
      scope: { ownerAccountId: "acc_1" },
      type: "income",
      amount: 6000,
      currency: "USD",
      category: "salary",
      occurredAt: new Date("2026-08-01T00:00:00.000Z"),
    });

    finance.recordEntry({
      scope: { ownerAccountId: "acc_1" },
      type: "expense",
      amount: 1200,
      currency: "USD",
      category: "rent",
      occurredAt: new Date("2026-08-02T00:00:00.000Z"),
    });

    const target = finance.createSavingsTarget({
      scope: { ownerAccountId: "acc_1" },
      name: "Emergency fund",
      targetAmount: 10000,
      currency: "USD",
    });

    finance.addSavings(target.id, 500);

    const overview = finance.overview({ ownerAccountId: "acc_1" });

    expect(overview.income).toBe(6000);
    expect(overview.expenses).toBe(1200);
    expect(overview.balance).toBe(4800);
    expect(overview.byCategory.rent).toBe(1200);
  });
});
