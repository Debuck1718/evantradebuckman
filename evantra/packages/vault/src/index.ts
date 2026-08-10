export type VaultScope = {
  ownerAccountId: string;
  organizationId?: string;
};

export type VaultDocumentCategory =
  | "certificate"
  | "cv"
  | "id-record"
  | "contract"
  | "receipt"
  | "project-doc"
  | "academic-record"
  | "business-doc"
  | "other";

export interface VaultDocument {
  id: string;
  scope: VaultScope;
  category: VaultDocumentCategory;
  title: string;
  storageKey: string;
  mimeType: string;
  tags: readonly string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessGrant {
  documentId: string;
  accountId: string;
  permission: "view" | "edit";
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

export class VaultWorkspace {
  private readonly docs = new Map<string, VaultDocument>();
  private readonly grants: AccessGrant[] = [];

  storeDocument(input: Omit<VaultDocument, "id" | "createdAt" | "updatedAt">): VaultDocument {
    const now = new Date();

    const doc: VaultDocument = {
      id: createId(),
      ...input,
      title: input.title.trim(),
      tags: [...new Set(input.tags.map(tag => tag.toLowerCase()))],
      createdAt: now,
      updatedAt: now,
    };

    this.docs.set(doc.id, doc);
    return doc;
  }

  grantAccess(documentId: string, accountId: string, permission: "view" | "edit"): AccessGrant {
    this.requireDocument(documentId);

    const existing = this.grants.find(
      grant => grant.documentId === documentId && grant.accountId === accountId,
    );

    if (existing) {
      existing.permission = permission;
      return existing;
    }

    const grant: AccessGrant = {
      documentId,
      accountId,
      permission,
    };

    this.grants.push(grant);
    return grant;
  }

  revokeAccess(documentId: string, accountId: string): boolean {
    const index = this.grants.findIndex(
      grant => grant.documentId === documentId && grant.accountId === accountId,
    );

    if (index === -1) {
      return false;
    }

    this.grants.splice(index, 1);
    return true;
  }

  canAccess(documentId: string, accountId: string, mode: "view" | "edit"): boolean {
    const document = this.docs.get(documentId);

    if (!document) {
      return false;
    }

    if (document.scope.ownerAccountId === accountId) {
      return true;
    }

    const grant = this.grants.find(
      item => item.documentId === documentId && item.accountId === accountId,
    );

    if (!grant) {
      return false;
    }

    if (mode === "view") {
      return grant.permission === "view" || grant.permission === "edit";
    }

    return grant.permission === "edit";
  }

  listDocuments(scope: VaultScope): readonly VaultDocument[] {
    return [...this.docs.values()].filter(doc => this.sameScope(doc.scope, scope));
  }

  private sameScope(a: VaultScope, b: VaultScope): boolean {
    return a.ownerAccountId === b.ownerAccountId && a.organizationId === b.organizationId;
  }

  private requireDocument(documentId: string): VaultDocument {
    const doc = this.docs.get(documentId);
    if (!doc) {
      throw new Error(`Document '${documentId}' not found.`);
    }

    return doc;
  }
}
