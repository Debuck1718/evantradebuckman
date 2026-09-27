-- Converts an existing OAuth client to a PUBLIC client.
--
-- WHY
--
-- A client is public when it holds no secret. This
-- stores the empty string in client_secret_hash,
-- which is precisely what Client.isPublic() tests:
--
--   isPublic() { return this.clientSecretHash === "" }
--
-- A public client cannot present a secret (the token
-- endpoint rejects that with invalid_client) and
-- authenticates with PKCE alone, which is the only
-- correct arrangement for a native app: a secret
-- shipped inside a mobile binary is extractable and
-- proves nothing.
--
-- Only run this for clients that are genuinely public
-- — browser SPAs and native apps. A server-side
-- confidential client that loses its secret this way
-- becomes unauthenticated.
--
-- The empty string is the sentinel, NOT a real secret.
-- hasher.verify("", "") would match, which is why
-- authenticate() branches on isPublic() BEFORE
-- reaching the hasher and never verifies an empty
-- secret.

-- ============================================================
-- 1. CHECK FIRST — read this before applying
-- ============================================================

SELECT
  client_id,
  name,
  status,
  CASE
    WHEN client_secret_hash = '' THEN 'already public'
    ELSE 'confidential (has a secret)'
  END AS current_type,
  length(client_secret_hash) AS hash_length
FROM identity.clients
WHERE client_id = 'cli_sd-a-gkgculdw48qm3pmuhbkfkbqnzloakghgoxot5k';

-- ============================================================
-- 2. APPLY
-- ============================================================

-- UPDATE identity.clients
-- SET client_secret_hash = '',
--     updated_at = now()
-- WHERE client_id = 'cli_sd-a-gkgculdw48qm3pmuhbkfkbqnzloakghgoxot5k'
--   AND client_secret_hash <> '';

-- ============================================================
-- 3. VERIFY
-- ============================================================

-- Expect: public, and 3 registered scopes.
-- If registered_scopes is not 3, the earlier backfill
-- did not reach this client.

SELECT
  c.client_id,
  c.status,
  CASE
    WHEN c.client_secret_hash = '' THEN 'public'
    ELSE 'confidential'
  END AS client_type,
  count(cs.id) AS registered_scopes
FROM identity.clients AS c
LEFT JOIN identity.client_scopes AS cs
  ON cs.client_id = c.id
WHERE c.client_id = 'cli_sd-a-gkgculdw48qm3pmuhbkfkbqnzloakghgoxot5k'
GROUP BY c.client_id, c.status, c.client_secret_hash;
