-- ============================================================
-- Security notification preferences
-- ============================================================
--
-- Stores per-account opt-outs for security alert email. A missing
-- row means "all enabled", so existing accounts need no backfill and
-- the application can treat absence as the default.
--
-- The in-app record in workspace.notifications is always written
-- regardless of these flags: the audit trail is not optional, only
-- the email is.

CREATE TABLE IF NOT EXISTS workspace.notification_preferences (
  account_id             VARCHAR(64) PRIMARY KEY
                         REFERENCES identity.accounts (id) ON DELETE CASCADE,

  -- Master switch. When false, no security email is sent at all.
  security_email_enabled BOOLEAN NOT NULL DEFAULT TRUE,

  -- Email when a device signs in that we have not seen before.
  new_device_email       BOOLEAN NOT NULL DEFAULT TRUE,

  -- Email when an application is granted access to the account.
  app_authorized_email   BOOLEAN NOT NULL DEFAULT TRUE,

  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Verification
-- ============================================================

DO $$
BEGIN
  IF to_regclass('workspace.notification_preferences') IS NULL THEN
    RAISE EXCEPTION
      'workspace.notification_preferences was not created.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'workspace'
      AND table_name = 'notification_preferences'
      AND column_name IN (
        'account_id', 'security_email_enabled',
        'new_device_email', 'app_authorized_email'
      )
    GROUP BY table_schema, table_name
    HAVING COUNT(*) = 4
  ) THEN
    RAISE EXCEPTION
      'workspace.notification_preferences is missing required columns.';
  END IF;
END
$$;