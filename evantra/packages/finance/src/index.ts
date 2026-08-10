export type FinanceScope = {
  ownerAccountId: string;
  organizationId?: string;
};

export type LedgerEntryType =
  | "income"
  | "expense"
  | "transfer";

export interface LedgerEntry {
  id: string;
  scope: FinanceScope;
  type: LedgerEntryType;
  amount: number;
  currency: string;
  category: string;
  note?: string;
  occurredAt: Date;
}

export interface Budget {
  id: string;
  scope: FinanceScope;
  category: string;
  limit: number;
  currency: string;
  period: "monthly" | "weekly";
}

export interface SavingsTarget {
  id: string;
  scope: FinanceScope;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  dueAt?: Date;
}

export interface FinanceOverview {
  income: number;
  expenses: number;
  balance: number;
  byCategory: Record<string, number>;
}

function createId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return [Date.now().toString(36), Math.random().toString(36).slice(2)].join("-");
}

export class FinanceWorkspace {
  private readonly entries: LedgerEntry[] = [];
  private readonly budgets = new Map<string, Budget>();
  private readonly savingsTargets = new Map<string, SavingsTarget>();

  recordEntry(input: Omit<LedgerEntry, "id">): LedgerEntry {
    if (input.amount <= 0) {
      throw new Error("Entry amount must be positive.");
    }

    const entry: LedgerEntry = {
      id: createId(),
      ...input,
    };

    this.entries.push(entry);
    return entry;
  }

  createBudget(input: Omit<Budget, "id">): Budget {
    const budget: Budget = {
      id: createId(),
      ...input,
    };

    this.budgets.set(budget.id, budget);
    return budget;
  }

  createSavingsTarget(input: Omit<SavingsTarget, "id" | "currentAmount"> & { currentAmount?: number }): SavingsTarget {
    const target: SavingsTarget = {
      id: createId(),
      scope: input.scope,
      name: input.name,
      targetAmount: input.targetAmount,
      currentAmount: input.currentAmount ?? 0,
      currency: input.currency,
      dueAt: input.dueAt,
    };

    this.savingsTargets.set(target.id, target);
    return target;
  }

  addSavings(targetId: string, amount: number): SavingsTarget {
    const target = this.requireTarget(targetId);

    if (amount <= 0) {
      throw new Error("Savings amount must be positive.");
    }

    target.currentAmount += amount;
    return target;
  }

  overview(scope: FinanceScope): FinanceOverview {
    const scoped = this.entries.filter(entry => this.sameScope(entry.scope, scope));

    const income = scoped
      .filter(entry => entry.type === "income")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const expenses = scoped
      .filter(entry => entry.type === "expense")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const byCategory: Record<string, number> = {};

    for (const entry of scoped) {
      byCategory[entry.category] = (byCategory[entry.category] ?? 0) + entry.amount;
    }

    return {
      income,
      expenses,
      balance: income - expenses,
      byCategory,
    };
  }

  private requireTarget(targetId: string): SavingsTarget {
    const target = this.savingsTargets.get(targetId);
    if (!target) {
      throw new Error(`Savings target '${targetId}' not found.`);
    }
    return target;
  }

  private sameScope(a: FinanceScope, b: FinanceScope): boolean {
    return a.ownerAccountId === b.ownerAccountId && a.organizationId === b.organizationId;
  }
}
