-- The workspace schema is provisioned by the shared database.
-- This migration verifies the tables required by identity-web persistence.

DO $$
BEGIN
  IF to_regclass('workspace.workspaces') IS NULL
    OR to_regclass('workspace.members') IS NULL
    OR to_regclass('workspace.burden_snapshots') IS NULL
    OR to_regclass('workspace.promises') IS NULL
    OR to_regclass('workspace.promise_transitions') IS NULL
    OR to_regclass('workspace.documents') IS NULL
    OR to_regclass('workspace.knowledge_links') IS NULL
    OR to_regclass('workspace.events') IS NULL
    OR to_regclass('workspace.finance_accounts') IS NULL
    OR to_regclass('workspace.transactions') IS NULL
    OR to_regclass('workspace.assistant_threads') IS NULL
    OR to_regclass('workspace.assistant_messages') IS NULL
    OR NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'workspace'
        AND table_name = 'burden_snapshots'
        AND column_name IN ('workspace_id', 'account_id', 'score', 'band', 'recorded_at')
      GROUP BY table_schema, table_name
      HAVING COUNT(*) = 5
    )
    OR NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'workspace'
        AND table_name = 'promises'
        AND column_name IN ('workspace_id', 'creator_id', 'promiser_id', 'due_at', 'status')
      GROUP BY table_schema, table_name
      HAVING COUNT(*) = 5
    ) THEN
    RAISE EXCEPTION
      'The shared workspace schema is missing. Provision workspace tables before deploying identity-web.';
  END IF;
END
$$;
