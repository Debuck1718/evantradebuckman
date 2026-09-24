-- ============================================================
-- Diagnostic: why is a workspace member missing?
-- ============================================================
-- Run each block and read the counts. They pin down which
-- stage of provisioning is failing for an account.
--
-- Account ids are ULIDs, i.e. STRINGS. Always quote them:
--
--   WHERE id = '01M38GR3803ANNGFH84DMWDJ67'   -- correct
--   WHERE id =  01M38GR3803ANNGFH84DMWDJ67    -- SQL error 42601
--                                           -- (trailing junk after
--                                           --  numeric literal)
--
-- Replace the quoted id below with the one from the
-- /identity/session response, or drop the WHERE clause to
-- inspect every account.

-- ------------------------------------------------------------
-- A. Does the account itself exist, and is it active?
--    If this returns 0 rows, the workspace can never FK-link
--    to it: the id the web app passes does not match
--    identity.accounts.id.
-- ------------------------------------------------------------
SELECT id, evantra_id, contact_email, status
FROM identity.accounts
WHERE id = '01M38GR3803ANNGFH84DMWDJ67';      -- or: ORDER BY created_at DESC LIMIT 5;

-- ------------------------------------------------------------
-- B. Is there a workspace owned by the account?
--    0 rows here = provisioning never succeeded, and the old
--    004 backfill had nothing to copy. Run 005 to repair.
-- ------------------------------------------------------------
SELECT id, owner_id, slug, name, created_at
FROM workspace.workspaces
WHERE owner_id = '01M38GR3803ANNGFH84DMWDJ67';

-- ------------------------------------------------------------
-- C. Is there a membership row for the account?
--    0 rows while B returns a row = the membership was never
--    written. Run 005 to repair.
-- ------------------------------------------------------------
SELECT m.id, m.workspace_id, m.account_id, m.role, m.joined_at
FROM workspace.members AS m
WHERE m.account_id = '01M38GR3803ANNGFH84DMWDJ67';

-- ------------------------------------------------------------
-- D. How many accounts are still unprovisioned in total?
--    A quick health view across the whole database.
-- ------------------------------------------------------------
SELECT
  (SELECT COUNT(*) FROM identity.accounts WHERE status = 'ACTIVE') AS active_accounts,
  (SELECT COUNT(*) FROM workspace.workspaces)                      AS workspaces,
  (SELECT COUNT(*) FROM workspace.members)                         AS memberships,
  (
    SELECT COUNT(*)
    FROM identity.accounts AS a
    WHERE a.status = 'ACTIVE'
      AND NOT EXISTS (
        SELECT 1 FROM workspace.workspaces AS w WHERE w.owner_id = a.id
      )
  ) AS accounts_without_workspace,
  (
    SELECT COUNT(*)
    FROM identity.accounts AS a
    WHERE a.status = 'ACTIVE'
      AND NOT EXISTS (
        SELECT 1 FROM workspace.members AS m WHERE m.account_id = a.id
      )
  ) AS accounts_without_membership;

-- ------------------------------------------------------------
-- E. Column type sanity: owner_id / account_id must hold the
--    identity id verbatim. Both should be character varying
--    (64), matching identity.accounts.id.
-- ------------------------------------------------------------
SELECT table_name, column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'workspace'
  AND table_name IN ('workspaces', 'members')
  AND column_name IN ('owner_id', 'account_id')
ORDER BY table_name, column_name;