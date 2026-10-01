import type { Pool } from "pg";

import { getWorkspacePool } from "./_database";
import {
  getNotificationPreferences,
  notifySecurityEvent,
  shouldEmail,
} from "./_notifications";

/*
 * Connected applications, active sessions and security activity.
 *
 * These read the identity schema directly rather than the workspace
 * schema: the question "which apps have my Evantra ID, and when did I
 * last use them?" is answered by the OAuth tables (clients,
 * user_consents, access_tokens, refresh_tokens) and the device table
 * (browser_sessions), not by anything in workspace.*.
 *
 * Everything is filtered by account_id so one account can never
 * enumerate another's grants or devices.
 */

const database = new Proxy({} as Pool, {
  get(_target, property) {
    const pool = getWorkspacePool();
    const value = Reflect.get(pool, property) as unknown;
    return typeof value === "function" ? value.bind(pool) : value;
  },
});

export interface AppOrigin {
  /** Registered redirect URI this app was authorised through. */
  redirectUri: string;
  /** Host extracted from the URI, or the scheme for a native app. */
  host: string;
  /**
   * How the app receives the callback, which tells the user what kind
   * of application is holding their ID.
   *
   *   web     https://…            a website
   *   native  com.app://…          a mobile or desktop app
   *   loopback http://localhost    a local development client
   */
  kind: "web" | "native" | "loopback" | "unknown";
  /** True when this is the client's primary redirect. */
  primary: boolean;
}

export interface ConnectedApplication {
  clientId: string;
  name: string;
  slug: string | null;
  description: string | null;
  homepageUrl: string | null;
  firstParty: boolean;
  status: string;
  /** True when this account registered the client itself. */
  ownedByAccount: boolean;
  /** Distinct granted scopes, union of consents and live tokens. */
  scopes: string[];
  /** Where this app receives your ID — the "where did it come from" answer. */
  origins: AppOrigin[];
  grantedAt: string | null;
  /** Most recent token issue or refresh — the "last used" signal. */
  lastUsedAt: string | null;
  /** Sessions attributed to this client, for context. */
  sessionCount: number;
  /** Live (unexpired, unrevoked) access tokens. */
  activeTokenCount: number;
  /** Refresh tokens still valid. */
  activeRefreshCount: number;
  hasLiveAccess: boolean;
}

export interface ConnectedSession {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  browserVersion: string;
  operatingSystem: string;
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
  trusted: boolean;
  mfaVerified: boolean;
  trustLevel: string;
  authenticationMethod: string;
  status: string;
  lastSeenAt: string;
  createdAt: string;
  expiresAt: string;
  /** True when this looks like the session making the request. */
  isCurrent: boolean;
}

export interface SecurityEvent {
  id: string;
  action: string;
  severity: string;
  occurredAt: string;
  ipAddress: string | null;
  deviceName: string | null;
  metadata: Record<string, unknown> | null;
}

/*
 * Scope strings are space-delimited per RFC 6749. They arrive from
 * several columns, so they are split, trimmed and de-duplicated here
 * rather than in the UI.
 */
function parseScopes(...values: (string | null)[]): string[] {
  const set = new Set<string>();

  for (const value of values) {
    if (!value) continue;
    for (const scope of value.split(/\s+/)) {
      const trimmed = scope.trim();
      if (trimmed) set.add(trimmed);
    }
  }

  return [...set].sort();
}

function toIso(value: Date | string | null): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

/**
 * Classifies a redirect URI so the user can tell a website from an
 * app installed on their phone.
 *
 * The scheme is the signal: http(s) is a web client, a custom scheme
 * (com.livo.app://) is a native client, and a localhost/127.0.0.1
 * host is a development client — worth flagging, since a production
 * account should rarely be authorising one.
 */
function classifyOrigin(uri: string): Omit<AppOrigin, "primary"> {
  const trimmed = uri.trim();

  try {
    const parsed = new URL(trimmed);
    const scheme = parsed.protocol.replace(":", "").toLowerCase();
    const host = parsed.hostname.toLowerCase();

    if (scheme === "http" || scheme === "https") {
      const loopback =
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "::1" ||
        host.endsWith(".localhost");

      return {
        redirectUri: trimmed,
        host: parsed.host || host,
        kind: loopback ? "loopback" : "web",
      };
    }

    // Non-http scheme: a native app deep link.
    //
    // For com.livo.app://oauth/callback the app identity is the scheme
    // itself (com.livo.app) — everything after "://" is the path the
    // OS routes to inside the app. Taking the segment after the
    // separator would yield "oauth", which is a route, not the app.
    const schemeEnd = trimmed.indexOf("://");
    const appId =
      schemeEnd > 0 ? trimmed.slice(0, schemeEnd) : scheme;

    return {
      redirectUri: trimmed,
      host: appId,
      kind: "native",
    };
  } catch {
    return { redirectUri: trimmed, host: trimmed, kind: "unknown" };
  }
}

/**
 * Applications this account has authorised, with usage signals.
 *
 * The token/consent `client_id` column actually stores
 * identity.clients.id (the ULID primary key), NOT
 * clients.client_id (the "cli_..." string). Verified against live
 * data: joining on clients.client_id returns null names for every
 * row, while clients.id resolves StoreForge and Livo correctly.
 *
 * The join therefore matches c.id first, then falls back to
 * c.client_id and c.slug so a row written by an older code path —
 * or a client registered before the id convention settled — still
 * resolves to a name instead of appearing as a bare ULID.
 */
export async function listConnectedApplications(
  accountId: string,
): Promise<ConnectedApplication[]> {
  const result = await database.query<{
    client_id: string;
    name: string | null;
    slug: string | null;
    description: string | null;
    homepage_url: string | null;
    first_party: boolean | null;
    status: string | null;
    owner_account_id: string | null;
    consent_scopes: string | null;
    granted_at: Date | null;
    token_scopes: string | null;
    last_token_at: Date | null;
    active_tokens: string;
    active_refreshes: string;
    session_count: string;
    redirect_uris: { uri: string; primary: boolean }[] | null;
  }>(
    `
      WITH consent AS (
        SELECT client_id,
               string_agg(scope, ' ') AS scopes,
               MIN(granted_at)       AS granted_at
        FROM identity.user_consents
        WHERE account_id = $1 AND revoked_at IS NULL
        GROUP BY client_id
      ),
      tokens AS (
        SELECT client_id,
               string_agg(DISTINCT scope, ' ')                        AS scopes,
               MAX(created_at)                                        AS last_token_at,
               COUNT(*) FILTER (
                 WHERE revoked_at IS NULL AND expires_at > NOW()
               )                                                      AS active_tokens
        FROM identity.access_tokens
        WHERE account_id = $1
        GROUP BY client_id
      ),
      refreshes AS (
        SELECT client_id,
               COUNT(*) FILTER (
                 WHERE revoked_at IS NULL AND expires_at > NOW()
               ) AS active_refreshes
        FROM identity.refresh_tokens
        WHERE account_id = $1
        GROUP BY client_id
      ),
      sessions AS (
        SELECT client_id, COUNT(*) AS session_count
        FROM identity.browser_sessions
        WHERE account_id = $1 AND client_id IS NOT NULL
        GROUP BY client_id
      ),
      known AS (
        SELECT client_id FROM consent
        UNION SELECT client_id FROM tokens
        UNION SELECT client_id FROM refreshes
        UNION SELECT client_id FROM sessions
      ),
      redirects AS (
        SELECT r.client_id,
               json_agg(
                 json_build_object(
                   'uri', r.redirect_uri,
                   'primary', COALESCE(r.primary_redirect, false)
                 )
                 ORDER BY COALESCE(r.primary_redirect, false) DESC, r.redirect_uri
               ) AS uris
        FROM identity.client_redirect_uris AS r
        GROUP BY r.client_id
      )
      SELECT k.client_id,
             c.name,
             c.slug,
             c.description,
             c.homepage_url,
             c.first_party,
             c.status,
             c.owner_account_id,
             co.scopes        AS consent_scopes,
             co.granted_at    AS granted_at,
             t.scopes         AS token_scopes,
             t.last_token_at  AS last_token_at,
             COALESCE(t.active_tokens, 0)     AS active_tokens,
             COALESCE(r.active_refreshes, 0)  AS active_refreshes,
             COALESCE(s.session_count, 0)     AS session_count,
             d.uris                           AS redirect_uris
      FROM known AS k
      LEFT JOIN identity.clients AS c
        ON c.id        = k.client_id
        OR c.client_id = k.client_id
        OR c.slug      = k.client_id
      LEFT JOIN consent   AS co ON co.client_id = k.client_id
      LEFT JOIN tokens    AS t  ON t.client_id  = k.client_id
      LEFT JOIN refreshes AS r  ON r.client_id  = k.client_id
      LEFT JOIN sessions  AS s  ON s.client_id  = k.client_id
      LEFT JOIN redirects AS d
        ON d.client_id = COALESCE(c.id, k.client_id)
      ORDER BY COALESCE(t.last_token_at, co.granted_at) DESC NULLS LAST
    `,
    [accountId],
  );

  return result.rows.map((row) => {
    const activeTokens = Number(row.active_tokens);
    const activeRefreshes = Number(row.active_refreshes);

    return {
      clientId: row.client_id,
      name: row.name ?? row.slug ?? row.client_id,
      slug: row.slug,
      description: row.description,
      homepageUrl: row.homepage_url,
      firstParty: row.first_party === true,
      status: row.status ?? "UNKNOWN",
      ownedByAccount: row.owner_account_id === accountId,
      scopes: parseScopes(row.consent_scopes, row.token_scopes),
      origins: (row.redirect_uris ?? []).map((entry) => ({
        ...classifyOrigin(entry.uri),
        primary: entry.primary === true,
      })),
      grantedAt: toIso(row.granted_at),
      lastUsedAt: toIso(row.last_token_at),
      sessionCount: Number(row.session_count),
      activeTokenCount: activeTokens,
      activeRefreshCount: activeRefreshes,
      hasLiveAccess: activeTokens > 0 || activeRefreshes > 0,
    };
  });
}

/**
 * Devices signed in to this account, newest activity first.
 *
 * `currentSessionId` lets the UI mark "this device" and prevents the
 * visitor from revoking the session they are using.
 */
export async function listConnectedSessions(
  accountId: string,
  currentSessionId?: string,
): Promise<ConnectedSession[]> {
  const result = await database.query<{
    id: string;
    device_name: string | null;
    device_type: string | null;
    browser: string | null;
    browser_version: string | null;
    operating_system: string | null;
    ip_address: string | null;
    country: string | null;
    city: string | null;
    vpn_detected: boolean | null;
    proxy_detected: boolean | null;
    tor_detected: boolean | null;
    trusted: boolean | null;
    mfa_verified: boolean | null;
    trust_level: string | null;
    authentication_method: string | null;
    status: string | null;
    last_seen_at: Date | null;
    created_at: Date;
    expires_at: Date;
  }>(
    `
      SELECT id, device_name, device_type, browser, browser_version,
             operating_system, host(ip_address) AS ip_address,
             country, city, vpn_detected, proxy_detected, tor_detected,
             trusted, mfa_verified, trust_level, authentication_method,
             status, last_seen_at, created_at, expires_at
      FROM identity.browser_sessions
      WHERE account_id = $1
        AND revoked_at IS NULL
        AND terminated_at IS NULL
      ORDER BY last_seen_at DESC
      LIMIT 50
    `,
    [accountId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    deviceName: row.device_name ?? "Unknown device",
    deviceType: row.device_type ?? "unknown",
    browser: row.browser ?? "Unknown browser",
    browserVersion: row.browser_version ?? "",
    operatingSystem: row.operating_system ?? "Unknown OS",
    ipAddress: row.ip_address,
    country: row.country,
    city: row.city,
    isVpn: row.vpn_detected === true,
    isProxy: row.proxy_detected === true,
    isTor: row.tor_detected === true,
    trusted: row.trusted === true,
    mfaVerified: row.mfa_verified === true,
    trustLevel: row.trust_level ?? "unknown",
    authenticationMethod: row.authentication_method ?? "unknown",
    status: row.status ?? "unknown",
    lastSeenAt: toIso(row.last_seen_at) ?? toIso(row.created_at)!,
    createdAt: toIso(row.created_at)!,
    expiresAt: toIso(row.expires_at)!,
    isCurrent: currentSessionId !== undefined && row.id === currentSessionId,
  }));
}

/**
 * Recent security-relevant activity for this account.
 *
 * audit_events has no ip_address or device_name column — verified
 * against the live schema; only id, account_id, action, severity,
 * metadata and occurred_at exist, and metadata is currently empty.
 * Device context is therefore read from browser_sessions, matched on
 * the account, so an event row can still be shown with the device it
 * most plausibly came from. When there is no session to match, the
 * event is returned without device context rather than guessing.
 */
export async function listSecurityEvents(
  accountId: string,
  limit = 40,
): Promise<SecurityEvent[]> {
  const result = await database.query<{
    id: string;
    action: string;
    severity: string | null;
    occurred_at: Date;
    metadata: Record<string, unknown> | null;
    device_name: string | null;
    ip_address: string | null;
  }>(
    `
      SELECT e.id,
             e.action,
             e.severity,
             e.occurred_at,
             e.metadata,
             s.device_name,
             host(s.ip_address) AS ip_address
      FROM identity.audit_events AS e
      LEFT JOIN LATERAL (
        SELECT device_name, ip_address
        FROM identity.browser_sessions
        WHERE account_id = e.account_id
          AND last_seen_at <= e.occurred_at
        ORDER BY last_seen_at DESC
        LIMIT 1
      ) AS s ON TRUE
      WHERE e.account_id = $1
      ORDER BY e.occurred_at DESC
      LIMIT $2
    `,
    [accountId, Math.min(Math.max(limit, 1), 200)],
  );

  return result.rows.map((row) => ({
    id: row.id,
    action: row.action,
    severity: row.severity ?? "INFO",
    occurredAt: toIso(row.occurred_at)!,
    ipAddress: row.ip_address,
    deviceName: row.device_name,
    metadata: row.metadata,
  }));
}

/**
 * Revokes an application's access: every live access token, every
 * refresh token, and the consent rows themselves.
 *
 * All three are cleared because revoking only the tokens would leave
 * the consent in place, and the client could silently obtain new
 * tokens without the user being asked again.
 *
 * Runs in a transaction so a partial revoke cannot leave a client
 * with a live refresh token after the UI reports success.
 */
export async function revokeApplicationAccess(
  accountId: string,
  clientId: string,
  context?: {
    clientName?: string;
    /** When supplied, a confirmation email is sent. */
    notify?: { to: string; firstName?: string };
    appUrl?: string;
  },
): Promise<{ accessTokens: number; refreshTokens: number; consents: number }> {
  const client = await getWorkspacePool().connect();

  let result: { accessTokens: number; refreshTokens: number; consents: number };

  try {
    await client.query("BEGIN");

    const refresh = await client.query(
      `
        UPDATE identity.refresh_tokens
        SET revoked_at = NOW()
        WHERE account_id = $1 AND client_id = $2 AND revoked_at IS NULL
      `,
      [accountId, clientId],
    );

    const access = await client.query(
      `
        UPDATE identity.access_tokens
        SET revoked_at = NOW()
        WHERE account_id = $1 AND client_id = $2 AND revoked_at IS NULL
      `,
      [accountId, clientId],
    );

    const consent = await client.query(
      `
        UPDATE identity.user_consents
        SET revoked_at = NOW()
        WHERE account_id = $1 AND client_id = $2 AND revoked_at IS NULL
      `,
      [accountId, clientId],
    );

    await client.query("COMMIT");

    result = {
      accessTokens: access.rowCount ?? 0,
      refreshTokens: refresh.rowCount ?? 0,
      consents: consent.rowCount ?? 0,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  /*
   * Notification happens AFTER the transaction commits, so a mail
   * failure can never roll back a revocation the user asked for.
   * Preferences decide whether mail is sent; the in-app record is
   * always written.
   */
  const appName = context?.clientName ?? clientId;
  const prefs = await getNotificationPreferences(accountId);
  const emailAllowed = shouldEmail(prefs, "app_revoked");

  await notifySecurityEvent({
    accountId,
    type: "app_revoked",
    title: `Access revoked for ${appName}`,
    body:
      `${result.accessTokens} access token(s), ${result.refreshTokens} refresh ` +
      `token(s) and ${result.consents} consent(s) were cleared. ` +
      `${appName} must ask you again before it can reach your account.`,
    link: "/workspace/connections",
    email: context?.notify && emailAllowed
      ? {
          to: context.notify.to,
          firstName: context.notify.firstName,
          subject: `Access revoked for ${appName}`,
          headline: `${appName} no longer has access to your Evantra ID`,
          lines: [
            `You revoked access for ${appName}.`,
            `${result.accessTokens} access token(s) and ${result.refreshTokens} refresh token(s) were invalidated, and the stored consent was removed.`,
            `${appName} will need your explicit approval again before it can reach your account.`,
          ],
          meta: [
            { label: "Application", value: appName },
            { label: "Tokens cleared", value: String(result.accessTokens) },
            { label: "Refresh tokens", value: String(result.refreshTokens) },
            { label: "Consents removed", value: String(result.consents) },
          ],
          actionLabel: "Review connected apps",
          actionUrl: context?.appUrl
            ? `${context.appUrl}/workspace/connections`
            : undefined,
        }
      : undefined,
  });

  return result;
}

/**
 * Account contact details used for security notifications.
 *
 * identity.accounts has no `email` column — verified against the
 * live schema. contact_email is the only address stored, so it is
 * used directly. first_name may be null for accounts created before
 * profile capture, hence the optional greeting.
 */
export async function getAccountContact(accountId: string): Promise<{
  email: string | null;
  firstName: string | null;
} | null> {
  const result = await database.query<{
    contact_email: string | null;
    first_name: string | null;
  }>(
    `
      SELECT contact_email, first_name
      FROM identity.accounts
      WHERE id = $1
    `,
    [accountId],
  );

  const row = result.rows[0];
  if (!row) return null;

  return {
    email: row.contact_email?.trim() || null,
    firstName: row.first_name?.trim() || null,
  };
}

/**
 * Revokes a single device session. The current session is refused so
 * the visitor cannot lock themselves out from the page they are on.
 */
export async function revokeSession(
  accountId: string,
  sessionId: string,
  currentSessionId?: string,
  context?: {
    deviceName?: string;
    notify?: { to: string; firstName?: string };
    appUrl?: string;
  },
): Promise<boolean> {
  if (currentSessionId !== undefined && sessionId === currentSessionId) {
    throw new Error(
      "You cannot revoke the session you are currently using. Sign out instead.",
    );
  }

  const result = await database.query(
    `
      UPDATE identity.browser_sessions
      SET status = 'revoked',
          revoked_at = NOW(),
          updated_at = NOW()
      WHERE id = $1 AND account_id = $2 AND revoked_at IS NULL
    `,
    [sessionId, accountId],
  );

  const revoked = (result.rowCount ?? 0) > 0;

  /*
   * Alert after the update succeeds, never before: an email about a
   * revocation that did not happen would be worse than no email.
   */
  if (revoked) {
    const device = context?.deviceName ?? "an unrecognised device";
    const prefs = await getNotificationPreferences(accountId);
    const emailAllowed = shouldEmail(prefs, "device_revoked");

    await notifySecurityEvent({
      accountId,
      type: "device_revoked",
      title: `Device signed out: ${device}`,
      body:
        `You signed ${device} out of your Evantra ID. ` +
        `It must authenticate again before it can reach your account.`,
      link: "/workspace/connections",
      email: context?.notify && emailAllowed
        ? {
            to: context.notify.to,
            firstName: context.notify.firstName,
            subject: `Device signed out: ${device}`,
            headline: `A device was signed out of your Evantra ID`,
            lines: [
              `${device} was signed out and its session was terminated.`,
              "If you did this, no action is needed.",
              "If you did not, someone else may have access to your account. Change your password now.",
            ],
            meta: [{ label: "Device", value: device }],
            actionLabel: "Review devices",
            actionUrl: context?.appUrl
              ? `${context.appUrl}/workspace/connections`
              : undefined,
          }
        : undefined,
    });
  }

  return revoked;
}