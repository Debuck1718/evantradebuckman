import {
  defaultBurdenSnapshot,
  type BurdenSnapshot,
  type WorkspacePromise,
} from "../../workspace/lib/intelligence";

interface WorkspaceState {
  burden: BurdenSnapshot;
  promises: WorkspacePromise[];
}

const globalStore = globalThis as typeof globalThis & {
  __evantraWorkspaceStore?: Map<string, WorkspaceState>;
};

function store(): Map<string, WorkspaceState> {
  if (!globalStore.__evantraWorkspaceStore) {
    globalStore.__evantraWorkspaceStore = new Map<string, WorkspaceState>();
  }

  return globalStore.__evantraWorkspaceStore;
}

export function requireAccountId(accountId: string | null): string {
  const value = String(accountId ?? "").trim();

  if (!value) {
    throw new Error("accountId is required.");
  }

  return value;
}

export function workspaceState(accountId: string): WorkspaceState {
  const s = store();

  if (!s.has(accountId)) {
    s.set(accountId, {
      burden: { ...defaultBurdenSnapshot },
      promises: [],
    });
  }

  return s.get(accountId)!;
}
