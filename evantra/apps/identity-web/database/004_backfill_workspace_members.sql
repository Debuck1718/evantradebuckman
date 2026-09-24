
-- 1. Owner rows for workspaces whose owner has no member row.
INSERT INTO workspace.members (workspace_id, account_id, role)
SELECT w.id, w.owner_id, 'OWNER'
FROM workspace.workspaces AS w
WHERE NOT EXISTS (
  SELECT 1
  FROM workspace.members AS m
  WHERE m.workspace_id = w.id
    AND m.account_id = w.owner_id
)
ON CONFLICT (workspace_id, account_id) DO NOTHING;