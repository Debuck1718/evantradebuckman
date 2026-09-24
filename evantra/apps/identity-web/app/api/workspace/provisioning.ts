import type { Pool } from "pg";

import { getWorkspacePool } from "./_database";

/**
 * Workspace provisioning.
 *
 * A personal workspace is created automatically
 * the first time an account touches the
 * workspace surface, Gmail-style.
 *
 * The previous implementation only inserted a
 * row into workspace.workspaces. It never
 * created the matching workspace.members row,
 * so an account existed in the database, could
 * sign in, and still had no workspace
 * membership: every membership-scoped query
 * came back empty and the workspace looked
 * broken even though the account was healthy.
 *
 * ensurePersonalWorkspace() now writes BOTH
 * rows in a single transaction and is safe to
 * call on every request:
 *
 *   - workspace.workspaces  (the personal space,
 *                            slug-keyed and upserted)
 *   - workspace.members     (the owner row, on
 *                            the uq_workspace_member
 *                            (workspace_id, account_id)
 *                            constraint)
 *
 * It also backfills the owner membership for
 * workspaces that were created before this fix,
 * which is what repairs accounts that are
 * already signed in but missing from
 * workspace.members.
 */

const WORKSPACE_QUERY = `
  SELECT w.id
  FROM workspace.workspaces AS w
  LEFT JOIN workspace.members AS m
    ON m.workspace_id = w.id
   AND m.account_id = $1
  WHERE w.owner_id = $1 OR m.account_id IS NOT NULL
  ORDER BY (w.owner_id = $1) DESC, w.created_at ASC
  LIMIT 1
`;

function personalSlug(accountId: string): string {
  /*
   * Deterministic slug derived from the account
   * id so provision is idempotent under
   * concurrent first requests. Column is
   * varchar(64); 'personal-' is 9 chars.
   */
  return `personal-${accountId}`.slice(0, 64);
}

async function insertOwnerMembership(
  client: Pick<Pool, "query">,
  workspaceId: string,
  accountId: string,
): Promise<void> {
  await client.query(
    `
      INSERT INTO workspace.members (workspace_id, account_id, role)
      VALUES ($1, $2, 'OWNER')
      ON CONFLICT (workspace_id, account_id) DO NOTHING
    `,
    [workspaceId, accountId],
  );
}

/**
 * Returns the account's workspace id, creating
 * the personal workspace AND its owner
 * membership when the account has none.
 *
 * Safe to call from any workspace route.
 */
export async function ensurePersonalWorkspace(
  accountId: string,
): Promise<string> {
  const pool = getWorkspacePool();

  /*
   * Verify the account row first. workspace.workspaces.owner_id
   * and workspace.members.account_id both FK to
   * identity.accounts (id). If the id the session returned
   * does not exist there, every INSERT below is rejected and
   * the workspace silently never appears. Checking up front
   * turns that into one clear error naming the id.
   */
  const account = await pool.query<{ id: string }>(
    "SELECT id FROM identity.accounts WHERE id = $1",
    [accountId],
  );

  if (!account.rows[0]) {
    throw new Error(
      `No identity.accounts row for id '${accountId}'. ` +
        "The workspace cannot be provisioned until the account exists.",
    );
  }

  const existing = await pool.query<{ id: string }>(WORKSPACE_QUERY, [accountId]);

  if (existing.rows[0]) {
    /*
     * A workspace already exists for this
     * account. Make sure the owner membership
     * exists too: this is the backfill that
     * repairs accounts created before the
     * membership fix.
     */
    await insertOwnerMembership(pool, existing.rows[0].id, accountId);
    return existing.rows[0].id;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /*
     * Upsert the workspace. ON CONFLICT (slug)
     * DO UPDATE ... RETURNING id always yields a
     * row (unlike DO NOTHING, which returns
     * nothing when the slug already exists and
     * previously left callers with no id).
     */
    const upserted = await client.query<{ id: string }>(
      `
        INSERT INTO workspace.workspaces (owner_id, name, slug, type, tier)
        VALUES ($1, 'Personal Workspace', $2, 'PERSONAL', 'CORE')
        ON CONFLICT (slug) DO UPDATE
          SET updated_at = NOW()
        RETURNING id
      `,
      [accountId, personalSlug(accountId)],
    );

    let workspaceId = upserted.rows[0]?.id;

    if (!workspaceId) {
      /*
       * The slug belonged to another account:
       * fall back to any workspace this account
       * already owns or belongs to.
       */
      const afterRace = await client.query<{ id: string }>(WORKSPACE_QUERY, [
        accountId,
      ]);
      workspaceId = afterRace.rows[0]?.id;
    }

    if (!workspaceId) {
      throw new Error("Unable to resolve the account workspace.");
    }

    await insertOwnerMembership(client, workspaceId, accountId);

    await client.query("COMMIT");

    return workspaceId;
  } catch (error) {
    await client.query("ROLLBACK");

    /*
     * pg errors carry code/detail that the generic
     * workspaceErrorResponse would otherwise hide. Log them so a
     * failed provision (for example a foreign-key or
     * unique-constraint rejection) is diagnosable from the
     * server log instead of looking like a blank 500.
     */
    const detail =
      typeof error === "object" && error !== null
        ? JSON.stringify({
            code: (error as { code?: unknown }).code,
            detail: (error as { detail?: unknown }).detail,
            constraint: (error as { constraint?: unknown }).constraint,
          })
        : String(error);

    console.error(
      `[workspace] provisioning failed for account '${accountId}': ${detail}`,
    );

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Read-only lookup used where provisioning on
 * a GET would be unwanted. Returns undefined
 * when the account has no workspace yet.
 */
export async function findWorkspaceId(
  accountId: string,
): Promise<string | undefined> {
  const result = await getWorkspacePool().query<{ id: string }>(
    WORKSPACE_QUERY,
    [accountId],
  );

  return result.rows[0]?.id;
}