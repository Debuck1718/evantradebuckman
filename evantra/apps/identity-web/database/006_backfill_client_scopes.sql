-- Registers the default OIDC identity scopes for
-- every OAuth client that has none.
--
-- WHY
--
-- RegisterClientWorkflow did not write to
-- identity.client_scopes at all, so every client was
-- created with an empty registered scope set.
--
-- AuthorizeWorkflow resolves a request against that
-- set:
--
--   granted = clientScopes.filterAllowed(...)
--   if (granted.length !== effective.length)
--     throw new InvalidScopeError()
--
-- filterAllowed() intersects the requested scopes
-- with the registered ones. Against an empty set the
-- intersection is always empty, so the lengths could
-- never be equal and EVERY authorization request
-- failed with:
--
--   400 invalid_scope
--   "The requested scope is not registered for this client."
--
-- This is why the SDK, the consent screen and the
-- integration guides all document `openid profile
-- email` as the default while no client was actually
-- registered for it. The documented default and the
-- enforced default disagreed.
--
-- WHAT THIS DOES NOT DO
--
-- It does not grant any data access beyond the OIDC
-- identity claims. It does not touch clients that
-- already have scopes. It does not approve any
-- client: a client in PENDING_APPROVAL still cannot
-- complete a flow until an administrator approves it.

INSERT INTO identity.client_scopes (
  id,
  client_id,
  scope,
  created_at
)
SELECT
  gen_random_uuid()::text,
  c.id,
  s.scope,
  now()
FROM identity.clients AS c
CROSS JOIN (
  VALUES
    ('openid'),
    ('profile'),
    ('email')
) AS s(scope)
WHERE NOT EXISTS (
  SELECT 1
  FROM identity.client_scopes AS cs
  WHERE cs.client_id = c.id
)
ON CONFLICT (client_id, scope) DO NOTHING;

-- Report what happened, so the backfill is verifiable
-- rather than something you have to take on trust.
SELECT
  c.client_id,
  count(cs.id) AS registered_scopes
FROM identity.clients AS c
LEFT JOIN identity.client_scopes AS cs
  ON cs.client_id = c.id
GROUP BY c.client_id
ORDER BY c.client_id;
