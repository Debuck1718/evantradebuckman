import {
  AuthorizedWorkspaceContextProvider,
  WorkspaceAssistant,
  type AssistantIntent,
} from "@evantra/assistant";
import type { Pool } from "pg";

import {
  assessBurden,
  defaultBurdenSnapshot,
  type BurdenSnapshot,
  type PromiseStatus,
  type WorkspacePromise,
} from "../../workspace/lib/intelligence";

import { getWorkspacePool } from "./_database";
import { ensurePersonalWorkspace } from "./provisioning";
import {
  decryptVaultPayload,
  encryptVaultPayload,
} from "./_vault-crypto";
import { resolveInsightWithProviders } from "./_ai-providers";

/*
 * Persistence goes through the shared pool so
 * every workspace route resolves the same
 * connection (and the same missing-config
 * behaviour). getWorkspacePool() throws a
 * DatabaseConfigError when DATABASE_URL is
 * absent, which workspaceErrorResponse maps to
 * a clear 503 instead of a generic 500.
 *
 * A Proxy keeps pg's generic query overloads
 * intact (query<T>(...)) while still resolving
 * the pool lazily, per call.
 */
const database = new Proxy({} as Pool, {
  get(_target, property) {
    const pool = getWorkspacePool();
    const value = Reflect.get(pool, property) as unknown;
    return typeof value === "function" ? value.bind(pool) : value;
  },
});

interface BurdenRow {
  open_tasks: number;
  blocked_tasks: number;
  overdue_tasks: number;
  meetings_minutes_today: number;
  focus_minutes_today: number;
  recovery_minutes_today: number;
  commitments_due_soon: number;
}

interface PromiseRow {
  id: string;
  title: string;
  due_at: Date;
  status: PromiseStatus;
  created_at: Date;
}

interface KnowledgeRow {
  id: string;
  title: string;
  content: Record<string, unknown>;
  document_type: string;
  created_at: Date;
  updated_at: Date;
}

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  start_time: Date;
  end_time: Date;
  time_zone: string;
  is_focus_block: boolean;
  status: "CONFIRMED" | "TENTATIVE" | "CANCELLED";
  created_at: Date;
  updated_at: Date;
}

interface FinanceRow {
  id: string;
  amount: string;
  currency: string;
  direction: "IN" | "OUT";
  category: string;
  description: string | null;
  transacted_at: Date;
}

interface AssistantMessageRow { role: string; content: string; created_at: Date }

interface AssistantInsightResult {
  summary: string;
  actionItems: readonly string[];
  evidence: readonly { source: string; reference: string }[];
}

function mapBurden(row: BurdenRow): BurdenSnapshot {
  return {
    openTasks: row.open_tasks,
    blockedTasks: row.blocked_tasks,
    overdueTasks: row.overdue_tasks,
    meetingsMinutesToday: row.meetings_minutes_today,
    focusMinutesToday: row.focus_minutes_today,
    recoveryMinutesToday: row.recovery_minutes_today,
    commitmentsDueSoon: row.commitments_due_soon,
  };
}

function mapPromise(row: PromiseRow): WorkspacePromise {
  return {
    id: row.id,
    title: row.title,
    dueAt: row.due_at.toISOString(),
    status: row.status,
    createdAt: row.created_at.toISOString(),
  };
}

function mapKnowledge(row: KnowledgeRow) {
  const metadata = row.content ?? {};

  return {
    id: row.id,
    scope: { ownerAccountId: "" },
    type: (metadata.type ?? row.document_type.toLowerCase()) as
      | "note"
      | "idea"
      | "research"
      | "bookmark"
      | "reflection"
      | "document",
    title: row.title,
    content: typeof metadata.body === "string" ? metadata.body : "",
    tags: Array.isArray(metadata.tags) ? metadata.tags.filter(
      (tag): tag is string => typeof tag === "string",
    ) : [],
    relatedIds: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEvent(row: EventRow, workspaceId: string) {
  return {
    id: row.id,
    calendarId: workspaceId,
    title: row.title,
    description: row.description ?? undefined,
    startAt: row.start_time,
    endAt: row.end_time,
    allDay: false,
    isFocusBlock: row.is_focus_block,
    createdBy: "",
    attendeeIds: [],
    status: row.status.toLowerCase() as "confirmed" | "tentative" | "cancelled",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapFinance(row: FinanceRow) {
  return {
    id: row.id,
    type: row.direction === "IN" ? "income" as const : "expense" as const,
    amount: Number(row.amount),
    currency: row.currency,
    category: row.category,
    note: row.description ?? undefined,
    occurredAt: row.transacted_at,
  };
}

/*
 * Resolution and provisioning both live in
 * ./provisioning so repository and support
 * share one implementation (and one place that
 * creates the workspace.members owner row).
 */
async function workspaceIdFor(accountId: string): Promise<string> {
  return ensurePersonalWorkspace(accountId);
}

export async function getBurden(accountId: string): Promise<BurdenSnapshot> {
  const workspaceId = await workspaceIdFor(accountId);
  const result = await database.query<BurdenRow>(
    `
      SELECT open_tasks, blocked_tasks, overdue_tasks,
             meetings_minutes_today, focus_minutes_today,
             recovery_minutes_today, commitments_due_soon
      FROM workspace.burden_snapshots
      WHERE workspace_id = $1 AND account_id = $2
      ORDER BY recorded_at DESC
      LIMIT 1
    `,
    [workspaceId, accountId],
  );

  return result.rows[0] ? mapBurden(result.rows[0]) : { ...defaultBurdenSnapshot };
}

export async function saveBurden(
  accountId: string,
  snapshot: BurdenSnapshot,
): Promise<BurdenSnapshot> {
  const workspaceId = await workspaceIdFor(accountId);
  const assessment = assessBurden(snapshot);

  const result = await database.query<BurdenRow>(
    `
      INSERT INTO workspace.burden_snapshots (
        workspace_id, account_id, score, band, open_tasks, blocked_tasks,
        overdue_tasks, meetings_minutes_today, focus_minutes_today,
        recovery_minutes_today, commitments_due_soon
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING open_tasks, blocked_tasks, overdue_tasks,
                meetings_minutes_today, focus_minutes_today,
                recovery_minutes_today, commitments_due_soon
    `,
    [
      workspaceId,
      accountId,
      assessment.score,
      assessment.band,
      snapshot.openTasks,
      snapshot.blockedTasks,
      snapshot.overdueTasks,
      snapshot.meetingsMinutesToday,
      snapshot.focusMinutesToday,
      snapshot.recoveryMinutesToday,
      snapshot.commitmentsDueSoon,
    ],
  );

  return mapBurden(result.rows[0]);
}

export async function listPromises(accountId: string): Promise<WorkspacePromise[]> {
  const workspaceId = await workspaceIdFor(accountId);
  const result = await database.query<PromiseRow>(
    `
      SELECT id, title, due_at, status, created_at
      FROM workspace.promises
      WHERE workspace_id = $1
        AND (
          creator_id = $2 OR
          promiser_id = $2 OR
          promisee_id = $2
        )
      ORDER BY created_at DESC
    `,
    [workspaceId, accountId],
  );

  return result.rows.map(mapPromise);
}

export async function createWorkspacePromise(
  accountId: string,
  item: WorkspacePromise,
): Promise<WorkspacePromise> {
  const workspaceId = await workspaceIdFor(accountId);
  const client = await database.connect();

  try {
    await client.query("BEGIN");
    const result = await client.query<PromiseRow>(
      `
        INSERT INTO workspace.promises (
          id, workspace_id, creator_id, promiser_id, title, due_at, status, created_at
        )
        VALUES ($1, $2, $3, $3, $4, $5, $6, $7)
        RETURNING id, title, due_at, status, created_at
      `,
      [item.id, workspaceId, accountId, item.title, item.dueAt, item.status, item.createdAt],
    );

    await client.query("COMMIT");
    return mapPromise(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updatePromiseStatus(
  accountId: string,
  id: string,
  status: PromiseStatus,
): Promise<void> {
  const workspaceId = await workspaceIdFor(accountId);
  const client = await database.connect();

  try {
    await client.query("BEGIN");
    const current = await client.query<{ status: PromiseStatus }>(
      `
        SELECT status
        FROM workspace.promises
        WHERE id = $1 AND workspace_id = $2
          AND (creator_id = $3 OR promiser_id = $3 OR promisee_id = $3)
        FOR UPDATE
      `,
      [id, workspaceId, accountId],
    );

    if (current.rowCount !== 1) {
      throw new Error("Promise not found.");
    }

    const result = await client.query(
      `
        UPDATE workspace.promises
        SET status = $1, updated_at = NOW()
        WHERE id = $2 AND workspace_id = $3
          AND (creator_id = $4 OR promiser_id = $4 OR promisee_id = $4)
      `,
      [status, id, workspaceId, accountId],
    );

    if (result.rowCount !== 1) {
      throw new Error("Promise not found.");
    }

    await client.query(
      `
        INSERT INTO workspace.promise_transitions (
          promise_id, from_status, to_status, actor_id
        )
        VALUES ($1, $2, $3, $4)
      `,
      [id, current.rows[0].status, status, accountId],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listKnowledgeItems(accountId: string, query = "") {
  const workspaceId = await workspaceIdFor(accountId);
  const result = await database.query<KnowledgeRow>(
    `
      SELECT id, title, content, document_type, created_at, updated_at
      FROM workspace.documents
      WHERE workspace_id = $1 AND author_id = $2 AND is_archived = false
        AND ($3 = '' OR title ILIKE '%' || $3 || '%' OR content::text ILIKE '%' || $3 || '%')
      ORDER BY updated_at DESC
    `,
    [workspaceId, accountId, query.trim()],
  );

  return result.rows.map(row => ({
    ...mapKnowledge(row),
    scope: { ownerAccountId: accountId },
  }));
}

export async function createKnowledgeItem(
  accountId: string,
  input: {
    title: string;
    content: string;
    type: string;
    tags: string[];
  },
) {
  const workspaceId = await workspaceIdFor(accountId);
  const result = await database.query<KnowledgeRow>(
    `
      INSERT INTO workspace.documents (
        workspace_id, author_id, title, slug, content, document_type
      )
      VALUES ($1, $2, $3, $4, $5::jsonb, $6)
      RETURNING id, title, content, document_type, created_at, updated_at
    `,
    [
      workspaceId,
      accountId,
      input.title.trim(),
      `${input.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      JSON.stringify({ body: input.content, tags: input.tags, type: input.type }),
      input.type.toUpperCase(),
    ],
  );

  return {
    ...mapKnowledge(result.rows[0]),
    scope: { ownerAccountId: accountId },
  };
}

export async function relateKnowledgeItems(
  accountId: string,
  sourceId: string,
  targetId: string,
) {
  const workspaceId = await workspaceIdFor(accountId);
  await database.query(
    `
      INSERT INTO workspace.knowledge_links (
        workspace_id, source_document_id, target_document_id, relationship
      )
      SELECT $1, source.id, target.id, 'REFERENCES'
      FROM workspace.documents AS source
      JOIN workspace.documents AS target ON target.id = $3
      WHERE source.id = $2 AND source.workspace_id = $1 AND target.workspace_id = $1
        AND source.author_id = $4
      ON CONFLICT (source_document_id, target_document_id, relationship) DO NOTHING
    `,
    [workspaceId, sourceId, targetId, accountId],
  );
}

export async function listWorkspaceEvents(accountId: string) {
  const workspaceId = await workspaceIdFor(accountId);
  const result = await database.query<EventRow>(
    `
      SELECT id, title, description, start_time, end_time, time_zone,
             is_focus_block, status, created_at, updated_at
      FROM workspace.events
      WHERE workspace_id = $1 AND organizer_id = $2 AND status <> 'CANCELLED'
        AND end_time >= NOW() - INTERVAL '1 day'
      ORDER BY start_time ASC
      LIMIT 100
    `,
    [workspaceId, accountId],
  );

  return result.rows.map(row => mapEvent(row, workspaceId));
}

export async function createWorkspaceEvent(
  accountId: string,
  input: { title: string; description?: string; startAt: string; endAt: string; focusBlock: boolean },
) {
  const workspaceId = await workspaceIdFor(accountId);
  const startAt = new Date(input.startAt);
  const endAt = new Date(input.endAt);

  if (!Number.isFinite(startAt.getTime()) || !Number.isFinite(endAt.getTime()) || endAt <= startAt) {
    throw new Error("Event end time must be after its start time.");
  }

  const conflict = await database.query(
    `
      SELECT 1 FROM workspace.events
      WHERE workspace_id = $1 AND organizer_id = $2 AND status <> 'CANCELLED'
        AND start_time < $4 AND end_time > $3
      LIMIT 1
    `,
    [workspaceId, accountId, startAt, endAt],
  );

  if (conflict.rowCount) {
    throw new Error("Event conflicts with an existing schedule.");
  }

  const result = await database.query<EventRow>(
    `
      INSERT INTO workspace.events (
        workspace_id, organizer_id, title, description, start_time, end_time,
        time_zone, is_focus_block
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title, description, start_time, end_time, time_zone,
                is_focus_block, status, created_at, updated_at
    `,
    [workspaceId, accountId, input.title.trim(), input.description?.trim() || null, startAt, endAt, "UTC", input.focusBlock],
  );

  return mapEvent(result.rows[0], workspaceId);
}

export async function listFinanceEntries(accountId: string) {
  const workspaceId = await workspaceIdFor(accountId);
  const result = await database.query<FinanceRow>(
    `
      SELECT t.id, t.amount, t.currency, t.direction, t.category,
             t.description, t.transacted_at
      FROM workspace.transactions AS t
      JOIN workspace.finance_accounts AS a ON a.id = t.finance_account_id
      WHERE t.workspace_id = $1 AND a.workspace_id = $1
      ORDER BY t.transacted_at DESC
      LIMIT 100
    `,
    [workspaceId],
  );

  return result.rows.map(mapFinance);
}

export async function createFinanceEntry(
  accountId: string,
  input: { type: "income" | "expense"; amount: number; currency: string; category: string; note?: string },
) {
  const workspaceId = await workspaceIdFor(accountId);
  const existingAccount = await database.query<{ id: string }>(
    "SELECT id FROM workspace.finance_accounts WHERE workspace_id = $1 ORDER BY created_at ASC LIMIT 1",
    [workspaceId],
  );
  const account = existingAccount.rows[0] ?? (await database.query<{ id: string }>(
    `
      INSERT INTO workspace.finance_accounts (workspace_id, name, type, currency)
      VALUES ($1, 'Primary account', 'OPERATING', $2)
      RETURNING id
    `,
    [workspaceId, input.currency],
  )).rows[0];

  if (!account) throw new Error("Unable to resolve the finance account.");

  const result = await database.query<FinanceRow>(
    `
      INSERT INTO workspace.transactions (
        workspace_id, finance_account_id, amount, currency, direction, category, description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, amount, currency, direction, category, description, transacted_at
    `,
    [workspaceId, account.id, input.amount, input.currency, input.type === "income" ? "IN" : "OUT", input.category.trim(), input.note?.trim() || null],
  );

  return mapFinance(result.rows[0]);
}

export async function listAssistantMessages(accountId: string, threadId: string) {
  const workspaceId = await workspaceIdFor(accountId);
  const result = await database.query<AssistantMessageRow>(
    `SELECT m.role, m.content, m.created_at
     FROM workspace.assistant_messages m
     JOIN workspace.assistant_threads t ON t.id = m.thread_id
     WHERE m.thread_id = $1 AND t.workspace_id = $2 AND t.account_id = $3
     ORDER BY m.created_at ASC`,
    [threadId, workspaceId, accountId],
  );
  return result.rows;
}

export async function askWorkspaceAssistant(
  accountId: string,
  threadId: string | undefined,
  intent: AssistantIntent,
  question: string,
) {
  const workspaceId = await workspaceIdFor(accountId);
  const thread = threadId
    ? await database.query<{ id: string }>(
      "SELECT id FROM workspace.assistant_threads WHERE id = $1 AND workspace_id = $2 AND account_id = $3",
      [threadId, workspaceId, accountId],
    )
    : { rows: [] as { id: string }[] };
  const resolvedThreadId = thread.rows[0]?.id ?? (await database.query<{ id: string }>(
    `INSERT INTO workspace.assistant_threads (workspace_id, account_id, title)
     VALUES ($1, $2, $3) RETURNING id`,
    [workspaceId, accountId, question.trim().slice(0, 255) || "Workspace briefing"],
  )).rows[0].id;

  const [promises, knowledge, events, finance] = await Promise.all([
    listPromises(accountId),
    listKnowledgeItems(accountId),
    listWorkspaceEvents(accountId),
    listFinanceEntries(accountId),
  ]);
  const assistant = new WorkspaceAssistant(new AuthorizedWorkspaceContextProvider({
    listPriorityTasks: async () => promises.filter(item => item.status !== "fulfilled" && item.status !== "cancelled").map(item => item.title),
    listProjects: async () => knowledge.filter(item => item.type === "document").map(item => item.title),
    listGoalsAtRisk: async () => promises.filter(item => item.status === "breached").map(item => item.title),
    listRelatedItems: async () => knowledge.slice(0, 10).map(item => item.title),
  }));
  const fallbackInsight = await assistant.answer(
    { ownerAccountId: accountId, allowedDatasets: ["planning", "knowledge", "calendar", "finance"] },
    { intent, question },
  );

  const aiInsight = await generateAiInsight({
    intent,
    question,
    promises,
    knowledge,
    events,
    finance,
    fallback: fallbackInsight,
  });

  await database.query(
    `INSERT INTO workspace.assistant_messages (thread_id, role, content, citations)
     VALUES ($1, 'user', $2, '[]'::jsonb), ($1, 'assistant', $3, $4::jsonb)`,
    [resolvedThreadId, question, aiInsight.insight.summary, JSON.stringify(aiInsight.insight.evidence)],
  );

  return { threadId: resolvedThreadId, insight: aiInsight.insight, provider: aiInsight.provider, messages: await listAssistantMessages(accountId, resolvedThreadId), finance: finance.length, events: events.length };
}

/*
 * Provider chain lives in ./_ai-providers so the OpenAI -> Gemini ->
 * fallback order is unit-testable without a database. This function
 * only assembles the workspace context that is safe to send, then
 * delegates.
 */
async function generateAiInsight(input: {
  intent: AssistantIntent;
  question: string;
  promises: WorkspacePromise[];
  knowledge: Awaited<ReturnType<typeof listKnowledgeItems>>;
  events: Awaited<ReturnType<typeof listWorkspaceEvents>>;
  finance: ReturnType<typeof mapFinance>[];
  fallback: AssistantInsightResult;
}): Promise<{ provider: "openai" | "gemini" | "fallback"; insight: AssistantInsightResult }> {
  const includeKnowledge = process.env.EVANTRA_AI_INCLUDE_KNOWLEDGE === "true";
  const includeFinance = process.env.EVANTRA_AI_INCLUDE_FINANCE === "true";

  const workspaceContext = {
    promises: input.promises.slice(0, 20).map((item) => ({
      title: item.title,
      status: item.status,
      dueAt: item.dueAt,
    })),
    knowledge: input.knowledge.slice(0, 20).map((item) =>
      includeKnowledge
        ? {
            title: item.title,
            type: item.type,
            tags: item.tags,
            content: item.content.slice(0, 800),
          }
        : { title: item.title, type: item.type, tags: item.tags },
    ),
    calendar: input.events.slice(0, 20).map((item) => ({
      title: item.title,
      startAt: item.startAt,
      endAt: item.endAt,
      focusBlock: item.isFocusBlock,
    })),
    finance: includeFinance
      ? input.finance.slice(0, 20).map((item) => ({
          type: item.type,
          amount: item.amount,
          currency: item.currency,
          category: item.category,
        }))
      : [],
  };

  const result = await resolveInsightWithProviders(
    {
      intent: input.intent,
      question: input.question,
      workspaceContext,
    },
    input.fallback,
  );

  return { provider: result.provider, insight: result.insight };
}


/* ------------------------------------------------------------------ */
/*                              Vault                                  */
/* ------------------------------------------------------------------ */

/*
 * workspace.vault_items stores ciphertext, not plaintext:
 * encrypted_payload / iv / auth_tag / key_version. Nothing in
 * this file ever writes a raw document body, and nothing reads
 * one without decrypting it first â€” so a database dump alone
 * does not expose vault contents.
 */

interface VaultRow {
  id: string;
  category: string;
  title: string;
  encrypted_payload: string;
  iv: string;
  auth_tag: string;
  key_version: number;
  tags: string[];
  is_favorite: boolean;
  created_at: Date;
  updated_at: Date;
}

export type VaultCategory =
  | "certificate"
  | "cv"
  | "id-record"
  | "contract"
  | "receipt"
  | "project-doc"
  | "academic-record"
  | "business-doc"
  | "other";

export interface VaultItem {
  id: string;
  category: VaultCategory;
  title: string;
  /** Decrypted body. Only ever returned to the owning account. */
  content: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function mapVaultItem(row: VaultRow): VaultItem {
  return {
    id: row.id,
    category: row.category as VaultCategory,
    title: row.title,
    content: decryptVaultPayload({
      ciphertext: row.encrypted_payload,
      iv: row.iv,
      authTag: row.auth_tag,
      keyVersion: row.key_version,
    }),
    tags: row.tags ?? [],
    isFavorite: row.is_favorite,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listVaultItems(accountId: string): Promise<VaultItem[]> {
  const workspaceId = await workspaceIdFor(accountId);

  const result = await database.query<VaultRow>(
    `
      SELECT id, category, title, encrypted_payload, iv, auth_tag,
             key_version, tags, is_favorite, created_at, updated_at
      FROM workspace.vault_items
      WHERE workspace_id = $1 AND account_id = $2
      ORDER BY is_favorite DESC, created_at DESC
    `,
    [workspaceId, accountId],
  );

  return result.rows.map(mapVaultItem);
}

export async function createVaultItem(
  accountId: string,
  input: {
    category: VaultCategory;
    title: string;
    content: string;
    tags?: readonly string[];
  },
): Promise<VaultItem> {
  const workspaceId = await workspaceIdFor(accountId);
  const sealed = encryptVaultPayload(input.content);

  const result = await database.query<VaultRow>(
    `
      INSERT INTO workspace.vault_items (
        workspace_id, account_id, category, title,
        encrypted_payload, iv, auth_tag, key_version, tags
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, category, title, encrypted_payload, iv, auth_tag,
                key_version, tags, is_favorite, created_at, updated_at
    `,
    [
      workspaceId,
      accountId,
      input.category,
      input.title.trim(),
      sealed.ciphertext,
      sealed.iv,
      sealed.authTag,
      sealed.keyVersion,
      [...new Set((input.tags ?? []).map((tag) => tag.toLowerCase()))],
    ],
  );

  return mapVaultItem(result.rows[0]);
}

/**
 * Deletes a vault item, scoped to the owning account so one
 * account can never delete another's record by guessing an id.
 * Returns false when nothing matched.
 */
export async function deleteVaultItem(
  accountId: string,
  itemId: string,
): Promise<boolean> {
  const workspaceId = await workspaceIdFor(accountId);

  const result = await database.query(
    `
      DELETE FROM workspace.vault_items
      WHERE id = $1 AND workspace_id = $2 AND account_id = $3
    `,
    [itemId, workspaceId, accountId],
  );

  return (result.rowCount ?? 0) > 0;
}

/**
 * Records that an item was opened. Kept separate from reads so
 * listing the vault does not mark everything as accessed.
 */
export async function touchVaultItem(
  accountId: string,
  itemId: string,
): Promise<void> {
  await database.query(
    `
      UPDATE workspace.vault_items
      SET accessed_at = NOW()
      WHERE id = $1 AND account_id = $2
    `,
    [itemId, accountId],
  );
}
