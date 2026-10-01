import type { Pool } from "pg";

import { getWorkspacePool } from "./_database";

/*
 * Security notifications.
 *
 * Two channels, deliberately independent:
 *
 *  1. In-app   — a row in workspace.notifications. Always written,
 *                because the record is useful even if mail fails.
 *  2. Email    — sent through Resend using the same
 *                RESEND_API_KEY / EVANTRA_EMAIL_FROM pair the
 *                identity service already uses, so one set of
 *                credentials covers both apps.
 *
 * Email is best-effort by design: a delivery failure must never fail
 * the security action that triggered it. A user revoking a device
 * should not see an error because Resend was down.
 */

const database = new Proxy({} as Pool, {
  get(_target, property) {
    const pool = getWorkspacePool();
    const value = Reflect.get(pool, property) as unknown;
    return typeof value === "function" ? value.bind(pool) : value;
  },
});

export type SecurityNotificationType =
  | "new_device"
  | "app_authorized"
  | "app_revoked"
  | "device_revoked"
  | "suspicious_session";

export interface SecurityNotificationInput {
  accountId: string;
  type: SecurityNotificationType;
  title: string;
  body: string;
  link?: string;
  /** When false, the in-app record is still written but no mail is sent. */
  email?: {
    to: string;
    firstName?: string;
    subject: string;
    headline: string;
    lines: string[];
    /** Key/value rows rendered as a summary table in the email. */
    meta?: { label: string; value: string }[];
    actionLabel?: string;
    actionUrl?: string;
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Branded transactional email.
 *
 * Table-based layout with inline styles, because mail clients strip
 * <style> blocks and do not support flexbox. Colours match the
 * product: #06131f base, #e6b24a accent.
 */
function renderSecurityEmail(input: {
  firstName?: string;
  headline: string;
  lines: string[];
  actionLabel?: string;
  actionUrl?: string;
  meta?: { label: string; value: string }[];
}): { html: string; text: string } {
  const greeting = input.firstName ? `Hi ${input.firstName},` : "Hi,";

  const metaRows = (input.meta ?? [])
    .map(
      (row) => `
        <tr>
          <td style="padding:6px 0;color:#8aa0b6;font-size:13px;width:140px;vertical-align:top;">${escapeHtml(row.label)}</td>
          <td style="padding:6px 0;color:#e8eef5;font-size:13px;font-weight:600;">${escapeHtml(row.value)}</td>
        </tr>`,
    )
    .join("");

  const bodyLines = input.lines
    .map(
      (line) =>
        `<p style="margin:0 0 14px;color:#c2d0de;font-size:14px;line-height:22px;">${escapeHtml(line)}</p>`,
    )
    .join("");

  const button = input.actionUrl
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
        <tr>
          <td style="background:#e6b24a;border-radius:10px;">
            <a href="${escapeHtml(input.actionUrl)}"
               style="display:inline-block;padding:13px 26px;color:#06131f;font-size:14px;font-weight:700;text-decoration:none;">
              ${escapeHtml(input.actionLabel ?? "Review activity")}
            </a>
          </td>
        </tr>
      </table>`
    : "";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(input.headline)}</title>
</head>
<body style="margin:0;padding:0;background:#06131f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#06131f;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:560px;background:#0b1a28;border:1px solid rgba(255,255,255,0.08);border-radius:18px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:26px 32px;border-bottom:1px solid rgba(255,255,255,0.07);">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:34px;height:34px;background:#e6b24a;border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="color:#06131f;font-size:17px;font-weight:800;line-height:34px;">E</span>
                  </td>
                  <td style="padding-left:12px;color:#ffffff;font-size:15px;font-weight:700;letter-spacing:0.4px;">
                    Evantra Identity
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 18px;color:#ffffff;font-size:19px;font-weight:700;line-height:28px;">
                ${escapeHtml(input.headline)}
              </p>
              <p style="margin:0 0 18px;color:#c2d0de;font-size:14px;line-height:22px;">${escapeHtml(greeting)}</p>
              ${bodyLines}
              ${metaRows ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0;padding:18px;width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;">${metaRows}</table>` : ""}
              ${button}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 32px;border-top:1px solid rgba(255,255,255,0.07);">
              <p style="margin:0;color:#6f8499;font-size:12px;line-height:19px;">
                If this was not you, sign in and revoke the session immediately, then change your password.
              </p>
              <p style="margin:10px 0 0;color:#4d6076;font-size:11px;">
                Evantra De-Buckman Ventures · This is an automated security notice.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    input.headline,
    "",
    greeting,
    "",
    ...input.lines,
    ...(input.meta ?? []).map((m) => `${m.label}: ${m.value}`),
    "",
    input.actionUrl ? `${input.actionLabel ?? "Review activity"}: ${input.actionUrl}` : "",
    "",
    "If this was not you, sign in and revoke the session immediately, then change your password.",
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}

/**
 * Sends one security email. Returns whether it was delivered.
 * Never throws: a mail failure must not break the caller's action.
 */
export async function sendSecurityEmail(input: {
  to: string;
  subject: string;
  firstName?: string;
  headline: string;
  lines: string[];
  actionLabel?: string;
  actionUrl?: string;
  meta?: { label: string; value: string }[];
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EVANTRA_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    return { sent: false, reason: "email-not-configured" };
  }

  if (!input.to || !input.to.includes("@")) {
    return { sent: false, reason: "no-recipient" };
  }

  const { html, text } = renderSecurityEmail(input);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[notifications] email delivery failed (${response.status}): ${detail.slice(0, 300)}`,
      );
      return { sent: false, reason: `http-${response.status}` };
    }

    return { sent: true };
  } catch (error) {
    console.error(
      `[notifications] email transport error: ${error instanceof Error ? error.message : String(error)
      }`,
    );
    return { sent: false, reason: "transport-error" };
  }
}

/**
 * Records a notification in-app and, when an email block is supplied,
 * also mails it.
 *
 * The in-app write happens first and its failure is swallowed too: a
 * missing notifications table must not stop a device being revoked.
 */
export async function notifySecurityEvent(
  input: SecurityNotificationInput,
): Promise<{ recorded: boolean; emailed: boolean }> {
  let recorded = false;

  try {
    await database.query(
      `
        INSERT INTO workspace.notifications (account_id, type, title, body, link)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        input.accountId,
        input.type,
        input.title,
        input.body,
        input.link ?? null,
      ],
    );
    recorded = true;
  } catch (error) {
    console.error(
      `[notifications] failed to record '${input.type}': ${error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  let emailed = false;

  if (input.email) {
    const result = await sendSecurityEmail({
      to: input.email.to,
      firstName: input.email.firstName,
      subject: input.email.subject,
      headline: input.email.headline,
      lines: input.email.lines,
      meta: input.email.meta,
      actionLabel: input.email.actionLabel,
      actionUrl: input.email.actionUrl,
    });
    emailed = result.sent;
  }

  return { recorded, emailed };
}

export interface NotificationPreferences {
  /** Master switch for security email. In-app records are always kept. */
  securityEmailEnabled: boolean;
  /** Email when a device signs in that we have not seen before. */
  newDeviceEmail: boolean;
  /** Email when an application is granted access. */
  appAuthorizedEmail: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  securityEmailEnabled: true,
  newDeviceEmail: true,
  appAuthorizedEmail: true,
};

/**
 * Preferences live in workspace.notification_preferences, keyed by
 * account. A missing row means defaults, so no backfill is required
 * for existing accounts.
 */
export async function getNotificationPreferences(
  accountId: string,
): Promise<NotificationPreferences> {
  try {
    const result = await database.query<{
      security_email_enabled: boolean;
      new_device_email: boolean;
      app_authorized_email: boolean;
    }>(
      `SELECT security_email_enabled, new_device_email, app_authorized_email
       FROM workspace.notification_preferences
       WHERE account_id = $1`,
      [accountId],
    );

    const row = result.rows[0];
    if (!row) return { ...DEFAULT_NOTIFICATION_PREFERENCES };

    return {
      securityEmailEnabled: row.security_email_enabled !== false,
      newDeviceEmail: row.new_device_email !== false,
      appAuthorizedEmail: row.app_authorized_email !== false,
    };
  } catch {
    // Table absent (older deployment) — behave as fully enabled.
    return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }
}

export async function saveNotificationPreferences(
  accountId: string,
  prefs: NotificationPreferences,
): Promise<NotificationPreferences> {
  await database.query(
    `
      INSERT INTO workspace.notification_preferences
        (account_id, security_email_enabled, new_device_email, app_authorized_email, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (account_id) DO UPDATE
        SET security_email_enabled = EXCLUDED.security_email_enabled,
            new_device_email      = EXCLUDED.new_device_email,
            app_authorized_email  = EXCLUDED.app_authorized_email,
            updated_at            = NOW()
    `,
    [
      accountId,
      prefs.securityEmailEnabled,
      prefs.newDeviceEmail,
      prefs.appAuthorizedEmail,
    ],
  );

  return prefs;
}

/**
 * Decides whether a given alert type should be emailed, applying the
 * master switch first and then the per-type flag.
 */
export function shouldEmail(
  prefs: NotificationPreferences,
  type: SecurityNotificationType,
): boolean {
  if (!prefs.securityEmailEnabled) return false;
  if (type === "new_device") return prefs.newDeviceEmail;
  if (type === "app_authorized") return prefs.appAuthorizedEmail;

  // Revocation and suspicious-activity mail always sends when the
  // master switch is on: these are the notices a user most needs.
  return true;
}