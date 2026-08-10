import { describe, expect, it } from "vitest";

import { VaultWorkspace } from "../index";

describe("VaultWorkspace", () => {
  it("manages owner and shared access", () => {
    const vault = new VaultWorkspace();

    const doc = vault.storeDocument({
      scope: { ownerAccountId: "owner_1" },
      category: "contract",
      title: "Partnership Agreement",
      storageKey: "vault/doc-001",
      mimeType: "application/pdf",
      tags: ["Legal", "Contracts"],
    });

    expect(vault.canAccess(doc.id, "owner_1", "view")).toBe(true);
    expect(vault.canAccess(doc.id, "worker_1", "view")).toBe(false);

    vault.grantAccess(doc.id, "worker_1", "view");
    expect(vault.canAccess(doc.id, "worker_1", "view")).toBe(true);
    expect(vault.canAccess(doc.id, "worker_1", "edit")).toBe(false);

    vault.grantAccess(doc.id, "worker_1", "edit");
    expect(vault.canAccess(doc.id, "worker_1", "edit")).toBe(true);

    vault.revokeAccess(doc.id, "worker_1");
    expect(vault.canAccess(doc.id, "worker_1", "view")).toBe(false);
  });
});
