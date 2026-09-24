-- ============================================================
-- 005 — Repair workspace provisioning from identity.accounts
-- ============================================================
--
-- Why this exists
-- ---------------
-- The previous backfill (004) copied owners from
-- workspace.workspaces into workspace.members. It matched
-- nothing when an account had NO workspace row at all,
-- which is the case for accounts that signed in while the
-- workspace database was unreachable (the original 500s).
-- Those accounts have an identity.accounts row and a valid
-- session, but neither a workspace nor a membership.
--
-- This migration provisions from identity.accounts directly,
-- so it repairs accounts missing a workspace AND accounts
-- missing only the membership row.
--
-- It is idempotent and safe to run repeatedly.
--
-- Account ids are ULIDs (26-char Crockford base32), matching
-- workspace.workspaces.owner_id / workspace.members.account_id
-- which are varchar(64) and FK to identity.accounts (id).

-- ------------------------------------------------------------
-- 1. Workspace row for every verified account that has none.
--    Slug is deterministic: personal-<account id>, truncated
--    to the varchar(64) limit and made unique with ON CONFLICT.
-- ------------------------------------------------------------
INSERT INTO workspace.workspaces (owner_id, name, slug, type, tier)
SELECT
  a.id,
  'Personal Workspace',
  left('personal-' || a.id, 64),
  'PERSONAL',
  'CORE'
FROM identity.accounts AS a
WHERE a.status = 'ACTIVE'
  AND NOT EXISTS (
    SELECT 1 FROM workspace.workspaces AS w WHERE w.owner_id = a.id
  )
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------
-- 2. OWNER membership for every workspace owner missing one.
--    Covers both the rows just created and pre-existing
--    workspaces from before the membership fix.
-- ------------------------------------------------------------
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