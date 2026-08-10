import { createId } from "../utils/createId";

export type PromiseScope = {
  ownerAccountId: string;
  organizationId?: string;
};

export type PromiseStatus =
  | "proposed"
  | "active"
  | "fulfilled"
  | "renegotiated"
  | "breached"
  | "cancelled";

export interface PromiseHistoryItem {
  at: Date;
  status: PromiseStatus;
  note?: string;
}

export interface PromiseCommitment {
  id: string;
  scope: PromiseScope;
  title: string;
  description?: string;
  ownerAccountId: string;
  counterpartyAccountId?: string;
  dueAt: Date;
  status: PromiseStatus;
  createdAt: Date;
  updatedAt: Date;
  history: readonly PromiseHistoryItem[];
}

export interface CreatePromiseInput {
  scope: PromiseScope;
  title: string;
  ownerAccountId: string;
  dueAt: Date;
  description?: string;
  counterpartyAccountId?: string;
}

export class PromiseGraph {
  private readonly commitments = new Map<string, PromiseCommitment>();

  create(input: CreatePromiseInput): PromiseCommitment {
    const now = new Date();

    if (!input.title.trim()) {
      throw new Error("Promise title is required.");
    }

    if (input.dueAt <= now) {
      throw new Error("Promise dueAt must be in the future.");
    }

    const commitment: PromiseCommitment = {
      id: createId(),
      scope: input.scope,
      title: input.title.trim(),
      description: input.description,
      ownerAccountId: input.ownerAccountId,
      counterpartyAccountId: input.counterpartyAccountId,
      dueAt: new Date(input.dueAt),
      status: "proposed",
      createdAt: now,
      updatedAt: now,
      history: [{ at: now, status: "proposed", note: "Created" }],
    };

    this.commitments.set(commitment.id, commitment);
    return commitment;
  }

  activate(id: string): PromiseCommitment {
    return this.transition(id, "active", "Accepted");
  }

  renegotiate(id: string, dueAt: Date, note?: string): PromiseCommitment {
    const commitment = this.require(id);

    if (dueAt <= new Date()) {
      throw new Error("Renegotiated dueAt must be in the future.");
    }

    commitment.dueAt = new Date(dueAt);
    return this.transition(id, "renegotiated", note ?? "Renegotiated timeline");
  }

  fulfill(id: string, note?: string): PromiseCommitment {
    return this.transition(id, "fulfilled", note ?? "Fulfilled");
  }

  breach(id: string, note?: string): PromiseCommitment {
    return this.transition(id, "breached", note ?? "Breached");
  }

  cancel(id: string, note?: string): PromiseCommitment {
    return this.transition(id, "cancelled", note ?? "Cancelled");
  }

  listScope(scope: PromiseScope): readonly PromiseCommitment[] {
    return [...this.commitments.values()]
      .filter(item => this.sameScope(item.scope, scope))
      .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
  }

  dueSoon(scope: PromiseScope, horizonHours = 72, now = new Date()): readonly PromiseCommitment[] {
    const end = new Date(now.getTime() + horizonHours * 60 * 60 * 1000);

    return this.listScope(scope).filter(item => {
      if (item.status === "fulfilled" || item.status === "cancelled") {
        return false;
      }

      return item.dueAt >= now && item.dueAt <= end;
    });
  }

  count(): number {
    return this.commitments.size;
  }

  private transition(id: string, status: PromiseStatus, note?: string): PromiseCommitment {
    const commitment = this.require(id);
    const now = new Date();

    commitment.status = status;
    commitment.updatedAt = now;
    commitment.history = [...commitment.history, { at: now, status, note }];

    return commitment;
  }

  private require(id: string): PromiseCommitment {
    const commitment = this.commitments.get(id);

    if (!commitment) {
      throw new Error(`Promise '${id}' not found.`);
    }

    return commitment;
  }

  private sameScope(a: PromiseScope, b: PromiseScope): boolean {
    return a.ownerAccountId === b.ownerAccountId && a.organizationId === b.organizationId;
  }
}
