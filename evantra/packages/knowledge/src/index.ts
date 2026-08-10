export type KnowledgeScope = {
  ownerAccountId: string;
  organizationId?: string;
};

export type KnowledgeItemType =
  | "note"
  | "idea"
  | "research"
  | "bookmark"
  | "reflection"
  | "document";

export interface KnowledgeItem {
  id: string;
  scope: KnowledgeScope;
  type: KnowledgeItemType;
  title: string;
  content: string;
  tags: readonly string[];
  relatedIds: readonly string[];
  createdAt: Date;
  updatedAt: Date;
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

export class KnowledgeWorkspace {
  private readonly items = new Map<string, KnowledgeItem>();

  createItem(input: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt" | "relatedIds"> & { relatedIds?: readonly string[] }): KnowledgeItem {
    const now = new Date();

    const item: KnowledgeItem = {
      id: createId(),
      scope: input.scope,
      type: input.type,
      title: input.title.trim(),
      content: input.content,
      tags: [...new Set(input.tags.map(tag => tag.toLowerCase()))],
      relatedIds: [...new Set(input.relatedIds ?? [])],
      createdAt: now,
      updatedAt: now,
    };

    this.items.set(item.id, item);
    return item;
  }

  relate(itemId: string, relatedId: string): void {
    const a = this.require(itemId);
    this.require(relatedId);

    if (itemId === relatedId) {
      return;
    }

    if (!a.relatedIds.includes(relatedId)) {
      a.relatedIds = [...a.relatedIds, relatedId];
      a.updatedAt = new Date();
    }
  }

  searchByTag(scope: KnowledgeScope, tag: string): readonly KnowledgeItem[] {
    const normalized = tag.toLowerCase();
    return this.listScope(scope).filter(item => item.tags.includes(normalized));
  }

  relatedCluster(itemId: string): readonly KnowledgeItem[] {
    const start = this.require(itemId);
    const visited = new Set<string>();
    const queue = [start.id];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) {
        continue;
      }

      visited.add(current);
      const node = this.items.get(current);
      if (!node) {
        continue;
      }

      for (const next of node.relatedIds) {
        if (!visited.has(next)) {
          queue.push(next);
        }
      }
    }

    return [...visited].map(id => this.require(id));
  }

  listScope(scope: KnowledgeScope): readonly KnowledgeItem[] {
    return [...this.items.values()].filter(item => this.sameScope(item.scope, scope));
  }

  private sameScope(a: KnowledgeScope, b: KnowledgeScope): boolean {
    return a.ownerAccountId === b.ownerAccountId && a.organizationId === b.organizationId;
  }

  private require(id: string): KnowledgeItem {
    const item = this.items.get(id);
    if (!item) {
      throw new Error(`Knowledge item '${id}' not found.`);
    }
    return item;
  }
}
