-- Evantra Workspace — Phase 3
-- Organization-level collaboration: discussions, announcements, events, activity feed.

-- ============================================================
-- Discussions (org-scoped threads + replies)
-- ============================================================

CREATE TABLE IF NOT EXISTS workspace.organization_discussions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES workspace.organizations (id) ON DELETE CASCADE,
  author_id       UUID NOT NULL,
  title           TEXT NOT NULL CHECK (length(title) BETWEEN 3 AND 200),
  body            TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 20000),
  pinned          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS org_discussions_org_idx
  ON workspace.organization_discussions (organization_id, created_at DESC);

CREATE TABLE IF NOT EXISTS workspace.organization_discussion_replies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES workspace.organization_discussions (id) ON DELETE CASCADE,
  author_id     UUID NOT NULL,
  body          TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 10000),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS org_discussion_replies_disc_idx
  ON workspace.organization_discussion_replies (discussion_id, created_at ASC);

-- ============================================================
-- Announcements (org-wide broadcasts; only OWNER/ADMIN may post)
-- ============================================================

CREATE TABLE IF NOT EXISTS workspace.organization_announcements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES workspace.organizations (id) ON DELETE CASCADE,
  author_id       UUID NOT NULL,
  title           TEXT NOT NULL CHECK (length(title) BETWEEN 3 AND 200),
  body            TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 20000),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS org_announcements_org_idx
  ON workspace.organization_announcements (organization_id, created_at DESC);

-- ============================================================
-- Events (org meetings / scheduled collaboration)
-- ============================================================

CREATE TABLE IF NOT EXISTS workspace.organization_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES workspace.organizations (id) ON DELETE CASCADE,
  created_by      UUID NOT NULL,
  title           TEXT NOT NULL CHECK (length(title) BETWEEN 3 AND 200),
  description     TEXT,
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ,
  location        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT org_event_times CHECK (ends_at IS NULL OR ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS org_events_org_idx
  ON workspace.organization_events (organization_id, starts_at ASC);

CREATE TABLE IF NOT EXISTS workspace.organization_event_rsvps (
  event_id     UUID NOT NULL REFERENCES workspace.organization_events (id) ON DELETE CASCADE,
  account_id   UUID NOT NULL,
  response     TEXT NOT NULL CHECK (response IN ('GOING','MAYBE','NO')),
  responded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (event_id, account_id)
);

-- ============================================================
-- Activity feed (audit trail of org actions)
-- ============================================================

CREATE TABLE IF NOT EXISTS workspace.organization_activity (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES workspace.organizations (id) ON DELETE CASCADE,
  account_id      UUID NOT NULL,
  type            TEXT NOT NULL,
  summary         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS org_activity_org_idx
  ON workspace.organization_activity (organization_id, created_at DESC);
