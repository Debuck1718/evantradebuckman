-- Evantra Workspace — Phase 2
-- Support requests, organizations, memberships, invites, notifications.

CREATE SCHEMA IF NOT EXISTS workspace;

-- ============================================================
-- Support requests (from any user to Evantra Team)
-- ============================================================

CREATE TABLE IF NOT EXISTS workspace.support_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL,
  account_id    VARCHAR(64) NOT NULL
                REFERENCES identity.accounts (id) ON DELETE CASCADE,
  contact_email TEXT NOT NULL,
  category      TEXT NOT NULL
                CHECK (category IN ('bug','account','billing','feature','other')),
  subject       TEXT NOT NULL CHECK (length(subject) BETWEEN 3 AND 255),
  message       TEXT NOT NULL CHECK (length(message) BETWEEN 10 AND 20000),
  status        TEXT NOT NULL DEFAULT 'OPEN'
                CHECK (status IN ('OPEN','IN_REVIEW','RESOLVED','DISMISSED')),
  admin_reply   TEXT,
  resolved_at   TIMESTAMPTZ,
  resolved_by   VARCHAR(64),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS support_requests_account_idx
  ON workspace.support_requests (account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS support_requests_status_idx
  ON workspace.support_requests (status, created_at DESC);

-- ============================================================
-- Organizations (collaborative workspaces on top of personal ones)
-- ============================================================

CREATE TABLE IF NOT EXISTS workspace.organizations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 120),
  slug        TEXT NOT NULL UNIQUE,
  kind        TEXT NOT NULL DEFAULT 'ORGANIZATION'
              CHECK (kind IN ('ORGANIZATION','PLATFORM')),
  description TEXT,
  creator_id  VARCHAR(64) NOT NULL
              REFERENCES identity.accounts (id) ON DELETE RESTRICT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspace.organization_members (
  organization_id UUID NOT NULL REFERENCES workspace.organizations (id) ON DELETE CASCADE,
  account_id      VARCHAR(64) NOT NULL
                  REFERENCES identity.accounts (id) ON DELETE CASCADE,
  role            TEXT NOT NULL DEFAULT 'MEMBER'
                  CHECK (role IN ('OWNER','ADMIN','MEMBER')),
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organization_id, account_id)
);

CREATE INDEX IF NOT EXISTS organization_members_account_idx
  ON workspace.organization_members (account_id);

-- ============================================================
-- Invitations (by email address or Evantra ID)
-- ============================================================

CREATE TABLE IF NOT EXISTS workspace.organization_invites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES workspace.organizations (id) ON DELETE CASCADE,
  invited_by      VARCHAR(64) NOT NULL
                  REFERENCES identity.accounts (id) ON DELETE RESTRICT,
  evantra_id      VARCHAR(64),
  status          TEXT NOT NULL DEFAULT 'PENDING'
                  CHECK (status IN ('PENDING','ACCEPTED','DECLINED','REVOKED')),
  invited_account_id VARCHAR(64)
                  REFERENCES identity.accounts (id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at    TIMESTAMPTZ,
  CONSTRAINT invite_target_required CHECK (evantra_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS organization_invites_evantra_idx
  ON workspace.organization_invites (evantra_id, status);

CREATE INDEX IF NOT EXISTS organization_invites_account_idx
  ON workspace.organization_invites (invited_account_id, status);

-- ============================================================
-- Notifications (per account)
-- ============================================================

CREATE TABLE IF NOT EXISTS workspace.notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id   VARCHAR(64) NOT NULL
               REFERENCES identity.accounts (id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT,
  link         TEXT,
  read_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_account_idx
  ON workspace.notifications (account_id, created_at DESC);

-- ============================================================
-- Inbound mailbox (Resend receiving webhook)
-- ============================================================

CREATE TABLE IF NOT EXISTS workspace.inbound_emails (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id  TEXT,
  from_email  TEXT NOT NULL,
  from_name   TEXT,
  to_email    TEXT NOT NULL,
  subject     TEXT,
  body_text   TEXT,
  body_html   TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at     TIMESTAMPTZ,
  handled_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS inbound_emails_received_idx
  ON workspace.inbound_emails (received_at DESC);
