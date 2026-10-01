"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Building2,
  CheckCircle2,
  Clock3,
  Fingerprint,
  Globe2,
  KeyRound,
  Laptop,
  Loader2,
  MapPin,
  Monitor,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";

import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { GlassCard } from "../../../components/ui/GlassCard";

/*
 * Connected applications, devices and security activity.
 *
 * This is the accountability surface: which applications hold the
 * user's Evantra ID, exactly what each can reach, when it was last
 * used, and a one-click revoke. Device sessions are listed with the
 * context the identity schema already records (device, OS, geo, VPN
 * and Tor signals) so an unfamiliar login is visible rather than
 * buried in a log.
 */

interface AppOrigin {
  redirectUri: string;
  host: string;
  kind: "web" | "native" | "loopback" | "unknown";
  primary: boolean;
}

interface ConnectedApplication {
  clientId: string;
  name: string;
  slug: string | null;
  description: string | null;
  homepageUrl: string | null;
  firstParty: boolean;
  status: string;
  ownedByAccount: boolean;
  scopes: string[];
  origins: AppOrigin[];
  grantedAt: string | null;
  lastUsedAt: string | null;
  sessionCount: number;
  activeTokenCount: number;
  activeRefreshCount: number;
  hasLiveAccess: boolean;
}

interface ConnectedSession {
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
  isCurrent: boolean;
}

interface SecurityEvent {
  id: string;
  action: string;
  severity: string;
  occurredAt: string;
  ipAddress: string | null;
  deviceName: string | null;
  metadata: Record<string, unknown> | null;
}

interface NotificationPreferences {
  securityEmailEnabled: boolean;
  newDeviceEmail: boolean;
  appAuthorizedEmail: boolean;
}

/** How an app receives the callback, in plain words. */
const ORIGIN_KIND_LABELS: Record<
  AppOrigin["kind"],
  { label: string; tone: string; hint: string }
> = {
  web: {
    label: "Website",
    tone: "text-sky-300 border-sky-400/25 bg-sky-400/10",
    hint: "You signed in through a website.",
  },
  native: {
    label: "Mobile / Desktop app",
    tone: "text-violet-300 border-violet-400/25 bg-violet-400/10",
    hint: "You signed in through an app installed on your device.",
  },
  loopback: {
    label: "Local development",
    tone: "text-amber-300 border-amber-400/25 bg-amber-400/10",
    hint: "A developer client running on localhost. Rare on a personal account.",
  },
  unknown: {
    label: "Unrecognised",
    tone: "text-white/60 border-white/15 bg-white/[0.04]",
    hint: "This redirect could not be classified.",
  },
};

/** Human scope descriptions. Unknown scopes are shown verbatim. */
const SCOPE_LABELS: Record<string, string> = {
  openid: "Verify your identity",
  profile: "Read your basic profile",
  email: "Read your email address",
  offline_access: "Stay signed in when you are away",
  address: "Read your postal address",
  phone: "Read your phone number",
};

/** Action code to a readable sentence plus a severity tone. */
const ACTION_META: Record<
  string,
  { label: string; tone: "ok" | "warn" | "danger" | "info" }
> = {
  LOGIN_SUCCESS: { label: "Signed in", tone: "ok" },
  LOGIN_FAILED: { label: "Failed sign-in attempt", tone: "danger" },
  LOGOUT: { label: "Signed out", tone: "info" },
  SESSION_REVOKED: { label: "Session revoked", tone: "warn" },
  PASSWORD_CHANGED: { label: "Password changed", tone: "warn" },
  CONSENT_GRANTED: { label: "App authorised", tone: "info" },
  CONSENT_REVOKED: { label: "App access revoked", tone: "warn" },
  TOKEN_REVOKED: { label: "Token revoked", tone: "warn" },
  ACCOUNT_CREATED: { label: "Account created", tone: "info" },
  MFA_ENABLED: { label: "Two-factor enabled", tone: "ok" },
  MFA_DISABLED: { label: "Two-factor disabled", tone: "danger" },
};

function relativeTime(iso: string | null): string {
  if (!iso) return "Never";

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Unknown";

  const seconds = Math.round((Date.now() - then) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} d ago`;

  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fullTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function deviceIcon(type: string, os: string) {
  const t = `${type} ${os}`.toLowerCase();
  if (t.includes("mobile") || t.includes("android") || t.includes("ios"))
    return Smartphone;
  if (t.includes("tablet")) return Monitor;
  return Laptop;
}

export default function ConnectionsPage() {
  const { account, session, loading } = useIdentitySession();

  const [applications, setApplications] = useState<ConnectedApplication[]>([]);
  const [sessions, setSessions] = useState<ConnectedSession[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    securityEmailEnabled: true,
    newDeviceEmail: true,
    appAuthorizedEmail: true,
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [tab, setTab] = useState<"apps" | "devices" | "activity">("apps");

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setBusy(true);
        setError(null);

        const response = await fetch("/api/workspace/connections", {
          cache: "no-store",
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(payload.error ?? "Unable to load connections.");
        }

        const payload = (await response.json()) as {
          applications: ConnectedApplication[];
          sessions: ConnectedSession[];
          events: SecurityEvent[];
        };

        setApplications(payload.applications);
        setSessions(payload.sessions);
        setEvents(payload.events);

        // Preferences come from the notifications route, which owns them.
        const prefsResponse = await fetch("/api/workspace/notifications", {
          cache: "no-store",
        });

        if (prefsResponse.ok) {
          const prefsPayload = (await prefsResponse.json()) as {
            preferences?: NotificationPreferences;
          };

          if (prefsPayload.preferences) {
            setPreferences(prefsPayload.preferences);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load connections.",
        );
      } finally {
        setBusy(false);
      }
    }

    if (session) void load();
  }, [session]);

  const riskCount = useMemo(
    () =>
      sessions.filter((s) => s.isTor || s.isProxy || !s.trusted).length +
      events.filter((e) => e.severity === "CRITICAL" || e.severity === "HIGH")
        .length,
    [sessions, events],
  );

  /**
   * Persists alert preferences. Optimistic, with rollback: the switch
   * flips immediately and reverts if the write fails, so the control
   * never lies about what is saved.
   */
  async function updatePreferences(
    patch: Partial<NotificationPreferences>,
  ): Promise<void> {
    const previous = preferences;
    const next = { ...preferences, ...patch };

    setPreferences(next);
    setSavingPrefs(true);
    setError(null);

    try {
      const response = await fetch("/api/workspace/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });

      if (!response.ok) throw new Error("Save failed.");

      setNotice("Alert preferences saved.");
      window.setTimeout(() => setNotice(null), 2500);
    } catch {
      setPreferences(previous);
      setError("Unable to save alert preferences.");
    } finally {
      setSavingPrefs(false);
    }
  }

  async function revokeApp(app: ConnectedApplication): Promise<void> {
    const previous = applications;
    setApplications((current) =>
      current.map((item) =>
        item.clientId === app.clientId
          ? {
              ...item,
              hasLiveAccess: false,
              activeTokenCount: 0,
              activeRefreshCount: 0,
            }
          : item,
      ),
    );

    try {
      const response = await fetch(
        `/api/workspace/connections?clientId=${encodeURIComponent(app.clientId)}`,
        { method: "DELETE" },
      );

      if (!response.ok) throw new Error("Revoke failed.");

      const payload = (await response.json()) as {
        accessTokens: number;
        refreshTokens: number;
        consents: number;
      };

      setNotice(
        `Access revoked for ${app.name}. Cleared ${payload.accessTokens} token(s), ` +
          `${payload.refreshTokens} refresh token(s) and ${payload.consents} consent(s).`,
      );
      window.setTimeout(() => setNotice(null), 5000);
    } catch {
      setApplications(previous);
      setError(`Unable to revoke access for ${app.name}.`);
    } finally {
      setConfirming(null);
    }
  }

  async function revokeDevice(device: ConnectedSession): Promise<void> {
    const previous = sessions;
    setSessions((current) => current.filter((item) => item.id !== device.id));

    try {
      const response = await fetch(
        `/api/workspace/connections?sessionId=${encodeURIComponent(device.id)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(payload.error ?? "Revoke failed.");
      }

      setNotice(`${device.deviceName} was signed out.`);
      window.setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      setSessions(previous);
      setError(err instanceof Error ? err.message : "Unable to revoke device.");
    } finally {
      setConfirming(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <Loader2 size={32} className="animate-spin text-[#e6b24a]" />
        </div>
      </main>
    );
  }

  if (!account || !session) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
          <GlassCard
            variant="elevated"
            className="w-full p-8 text-center sm:p-10"
          >
            <ShieldCheck size={40} className="mx-auto text-[#e6b24a]" />
            <h1 className="mt-6 text-2xl font-semibold">Sign in required</h1>
            <p className="mt-3 text-sm text-white/50">
              Connected applications are private to your account.
            </p>
            <Link
              href="/login?returnTo=/workspace/connections"
              className="mt-7 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f]"
            >
              Sign in with Evantra ID
            </Link>
          </GlassCard>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/workspace/hub"
                className="inline-flex items-center gap-1.5 text-xs text-white/50 transition hover:text-[#e6b24a]"
              >
                <ArrowLeft size={14} />
                Workspace Hub
              </Link>
              <span className="text-white/20">/</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#fae59a]">
                Connections
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Connected Apps &amp; Devices
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
              Every application holding your Evantra ID, what each one can
              reach, when it was last used, and every device signed in to your
              account. Revoke anything you do not recognise.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center">
              <p className="text-2xl font-semibold text-white">
                {applications.length}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-white/45">
                Apps
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center">
              <p className="text-2xl font-semibold text-white">
                {sessions.length}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-white/45">
                Devices
              </p>
            </div>
            <div
              className={`rounded-2xl border px-5 py-3 text-center ${
                riskCount > 0
                  ? "border-amber-400/30 bg-amber-400/10"
                  : "border-emerald-400/25 bg-emerald-400/[0.07]"
              }`}
            >
              <p
                className={`text-2xl font-semibold ${
                  riskCount > 0 ? "text-amber-300" : "text-emerald-300"
                }`}
              >
                {riskCount}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-white/45">
                Signals
              </p>
            </div>
          </div>
        </div>

        {notice && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-300">
            <CheckCircle2 size={15} />
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
            <AlertTriangle size={15} />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {(
            [
              ["apps", `Applications (${applications.length})`],
              ["devices", `Devices (${sessions.length})`],
              ["activity", `Security activity (${events.length})`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                tab === value
                  ? "border-[#e6b24a]/50 bg-[#e6b24a]/15 text-[#fae59a]"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {busy ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[#e6b24a]" />
          </div>
        ) : (
          <div className="mt-6">
            {/* ---------------- Applications ---------------- */}
            {tab === "apps" && (
              <div className="grid gap-5 lg:grid-cols-2">
                {applications.length === 0 ? (
                  <GlassCard
                    variant="default"
                    hover={false}
                    className="p-12 text-center lg:col-span-2"
                  >
                    <KeyRound size={40} className="mx-auto text-white/25" />
                    <h3 className="mt-5 text-lg font-semibold">
                      No applications connected
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
                      When you sign in to an Evantra application with your ID,
                      it will appear here with exactly what it can access.
                    </p>
                  </GlassCard>
                ) : (
                  applications.map((app) => (
                    <GlassCard
                      key={app.clientId}
                      variant="default"
                      hover={false}
                      className="flex flex-col p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05]">
                            <Building2 size={20} className="text-[#e6b24a]" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-base font-semibold text-white">
                                {app.name}
                              </h3>

                              {app.firstParty ? (
                                <span className="rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#fae59a]">
                                  First-party
                                </span>
                              ) : (
                                <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/55">
                                  Third-party
                                </span>
                              )}

                              {app.ownedByAccount && (
                                <span className="rounded-full border border-sky-400/25 bg-sky-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                                  You own this
                                </span>
                              )}
                            </div>

                            {app.description && (
                              <p className="mt-1.5 text-xs leading-5 text-white/55">
                                {app.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {app.hasLiveAccess ? (
                          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-white/45">
                            No live access
                          </span>
                        )}
                      </div>

                      {/* Scopes */}
                      <div className="mt-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                          Can access
                        </p>

                        <ul className="mt-2.5 space-y-1.5">
                          {app.scopes.length === 0 ? (
                            <li className="text-xs text-white/45">
                              No scopes recorded.
                            </li>
                          ) : (
                            app.scopes.map((scope) => (
                              <li
                                key={scope}
                                className="flex items-center gap-2 text-xs text-white/75"
                              >
                                <CheckCircle2
                                  size={13}
                                  className="shrink-0 text-emerald-400/70"
                                />
                                {SCOPE_LABELS[scope] ?? scope}
                              </li>
                            ))
                          )}
                        </ul>
                      </div>

                      {/* Origin — where the app received your ID */}
                      {app.origins.length > 0 && (
                        <div className="mt-5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                            Where it received your ID
                          </p>

                          <ul className="mt-2.5 space-y-2">
                            {app.origins.map((origin) => {
                              const meta = ORIGIN_KIND_LABELS[origin.kind];

                              return (
                                <li
                                  key={origin.redirectUri}
                                  className="rounded-xl border border-white/8 bg-white/[0.02] p-3"
                                >
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.tone}`}
                                    >
                                      {meta.label}
                                    </span>

                                    {origin.primary && (
                                      <span className="text-[10px] uppercase tracking-wider text-white/35">
                                        Primary
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-2 break-all font-mono text-[11px] text-white/70">
                                    {origin.redirectUri}
                                  </p>

                                  <p className="mt-1.5 text-[11px] leading-5 text-white/40">
                                    {meta.hint}
                                  </p>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Usage */}
                      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/8 pt-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/40">
                            Last used
                          </p>
                          <p
                            className="mt-1 text-sm font-medium text-white"
                            title={fullTime(app.lastUsedAt)}
                          >
                            {relativeTime(app.lastUsedAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/40">
                            Authorised
                          </p>
                          <p className="mt-1 text-sm font-medium text-white">
                            {relativeTime(app.grantedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/45">
                        <span className="rounded-full border border-white/10 px-2.5 py-1">
                          {app.activeTokenCount} access token
                          {app.activeTokenCount === 1 ? "" : "s"}
                        </span>
                        <span className="rounded-full border border-white/10 px-2.5 py-1">
                          {app.activeRefreshCount} refresh
                        </span>
                        {app.sessionCount > 0 && (
                          <span className="rounded-full border border-white/10 px-2.5 py-1">
                            {app.sessionCount} session
                            {app.sessionCount === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>

                      {/* Revoke */}
                      <div className="mt-5 flex items-center gap-3">
                        {confirming === app.clientId ? (
                          <>
                            <button
                              type="button"
                              onClick={() => void revokeApp(app)}
                              className="inline-flex items-center gap-2 rounded-xl bg-red-500/90 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-500"
                            >
                              <Ban size={14} />
                              Confirm revoke
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirming(null)}
                              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:border-white/20"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirming(app.clientId)}
                            disabled={!app.hasLiveAccess}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/85 transition hover:border-red-400/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={14} />
                            Revoke access
                          </button>
                        )}
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            )}

            {/* ---------------- Devices ---------------- */}
            {tab === "devices" && (
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <GlassCard
                    variant="default"
                    hover={false}
                    className="p-12 text-center"
                  >
                    <Monitor size={40} className="mx-auto text-white/25" />
                    <h3 className="mt-5 text-lg font-semibold">
                      No active devices
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
                      Devices signed in to your Evantra ID will appear here.
                    </p>
                  </GlassCard>
                ) : (
                  sessions.map((device) => {
                    const DeviceIcon = deviceIcon(
                      device.deviceType,
                      device.operatingSystem,
                    );
                    const risky = device.isTor || device.isProxy;

                    return (
                      <GlassCard
                        key={device.id}
                        variant={device.isCurrent ? "gold" : "default"}
                        hover={false}
                        className="p-5 sm:p-6"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05]">
                              <DeviceIcon
                                size={20}
                                className="text-[#e6b24a]"
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-base font-semibold text-white">
                                  {device.deviceName}
                                </h3>

                                {device.isCurrent && (
                                  <span className="rounded-full border border-[#e6b24a]/40 bg-[#e6b24a]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#fae59a]">
                                    This device
                                  </span>
                                )}

                                {device.mfaVerified && (
                                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                                    MFA
                                  </span>
                                )}

                                {risky && (
                                  <span className="flex items-center gap-1 rounded-full border border-red-400/30 bg-red-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-red-300">
                                    <ShieldAlert size={11} />
                                    {device.isTor ? "Tor" : "Proxy"}
                                  </span>
                                )}

                                {device.isVpn && (
                                  <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                                    VPN
                                  </span>
                                )}
                              </div>

                              <p className="mt-1.5 text-xs text-white/55">
                                {device.browser}
                                {device.browserVersion
                                  ? ` ${device.browserVersion}`
                                  : ""}{" "}
                                · {device.operatingSystem}
                              </p>

                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/40">
                                {(device.city || device.country) && (
                                  <span className="flex items-center gap-1.5">
                                    <MapPin size={12} />
                                    {[device.city, device.country]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </span>
                                )}
                                {device.ipAddress && (
                                  <span className="flex items-center gap-1.5">
                                    <Globe2 size={12} />
                                    {device.ipAddress}
                                  </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                  {device.isVpn || device.isProxy ? (
                                    <WifiOff size={12} />
                                  ) : (
                                    <Wifi size={12} />
                                  )}
                                  {device.authenticationMethod}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                            <div className="sm:text-right">
                              <p className="flex items-center gap-1.5 text-xs text-white/45 sm:justify-end">
                                <Clock3 size={12} />
                                Last active
                              </p>
                              <p
                                className="mt-0.5 text-sm font-medium text-white"
                                title={fullTime(device.lastSeenAt)}
                              >
                                {relativeTime(device.lastSeenAt)}
                              </p>
                            </div>

                            {confirming === device.id ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => void revokeDevice(device)}
                                  className="rounded-xl bg-red-500/90 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirming(null)}
                                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-white/20"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirming(device.id)}
                                disabled={device.isCurrent}
                                title={
                                  device.isCurrent
                                    ? "Use Sign out to end this session"
                                    : "Sign this device out"
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/85 transition hover:border-red-400/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Ban size={13} />
                                Revoke
                              </button>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })
                )}
              </div>
            )}

            {/* ---------------- Activity ---------------- */}
            {tab === "activity" && (
              <GlassCard variant="default" hover={false} className="p-6 sm:p-8">
                <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                  <Fingerprint size={18} className="text-[#e6b24a]" />
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Security activity
                    </h2>
                    <p className="text-xs text-white/50">
                      Sign-ins and account changes on your Evantra ID
                    </p>
                  </div>
                </div>

                {events.length === 0 ? (
                  <p className="py-12 text-center text-sm text-white/45">
                    No activity recorded yet.
                  </p>
                ) : (
                  <ul className="mt-2 divide-y divide-white/[0.06]">
                    {events.map((event) => {
                      const meta = ACTION_META[event.action] ?? {
                        label: event.action
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/^\w/, (c) => c.toUpperCase()),
                        tone: "info" as const,
                      };

                      const toneClass =
                        meta.tone === "ok"
                          ? "text-emerald-300"
                          : meta.tone === "danger"
                            ? "text-red-300"
                            : meta.tone === "warn"
                              ? "text-amber-300"
                              : "text-sky-300";

                      return (
                        <li
                          key={event.id}
                          className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                meta.tone === "ok"
                                  ? "bg-emerald-400"
                                  : meta.tone === "danger"
                                    ? "bg-red-400"
                                    : meta.tone === "warn"
                                      ? "bg-amber-400"
                                      : "bg-sky-400"
                              }`}
                            />
                            <div>
                              <p className={`text-sm font-medium ${toneClass}`}>
                                {meta.label}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/40">
                                {event.deviceName && (
                                  <span className="flex items-center gap-1.5">
                                    <Laptop size={11} />
                                    {event.deviceName}
                                  </span>
                                )}
                                {event.ipAddress && (
                                  <span className="flex items-center gap-1.5">
                                    <Globe2 size={11} />
                                    {event.ipAddress}
                                  </span>
                                )}
                                {event.severity !== "INFO" && (
                                  <span className="rounded-full border border-white/10 px-2 py-0.5 font-semibold">
                                    {event.severity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <span
                            className="shrink-0 text-[11px] text-white/45 sm:text-right"
                            title={fullTime(event.occurredAt)}
                          >
                            {relativeTime(event.occurredAt)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </GlassCard>
            )}
          </div>
        )}

        {/* Alert preferences */}
        <GlassCard variant="default" hover={false} className="mt-8 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <ShieldCheck size={18} className="text-[#e6b24a]" />
            <div>
              <h2 className="text-sm font-semibold text-white">
                Security alerts
              </h2>
              <p className="text-xs text-white/50">
                Sent to your account contact email. In-app records are always kept.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {(
              [
                [
                  "securityEmailEnabled",
                  "Email me about security activity",
                  "Master switch. Turn this off to stop all security email.",
                ],
                [
                  "newDeviceEmail",
                  "Alert me about new device sign-ins",
                  "A sign-in from a device you have not used before.",
                ],
                [
                  "appAuthorizedEmail",
                  "Alert me when an app is granted access",
                  "When an application is authorised to use your Evantra ID.",
                ],
              ] as const
            ).map(([key, label, description]) => {
              const enabled = preferences[key];
              const disabled =
                savingPrefs ||
                (key !== "securityEmailEnabled" &&
                  !preferences.securityEmailEnabled);

              return (
                <div
                  key={key}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      {description}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    aria-label={label}
                    disabled={disabled}
                    onClick={() =>
                      void updatePreferences({ [key]: !enabled })
                    }
                    className={`relative h-7 w-12 shrink-0 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      enabled
                        ? "border-[#e6b24a]/50 bg-[#e6b24a]/25"
                        : "border-white/15 bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${
                        enabled
                          ? "left-6 bg-[#e6b24a]"
                          : "left-0.5 bg-white/50"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {!preferences.securityEmailEnabled && (
            <p className="mt-4 flex items-center gap-2 text-xs text-amber-300">
              <AlertTriangle size={13} />
              Security email is off. You will still see activity in the app, but
              you will not be warned about new devices.
            </p>
          )}
        </GlassCard>

        {/* Guidance */}
        <GlassCard variant="default" hover={false} className="mt-8 p-6">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-[#e6b24a]" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Keep your account tight
              </h3>
              <p className="mt-2 text-xs leading-6 text-white/55">
                Revoke any application you no longer use — this clears its
                tokens and its consent, so it must ask you again before it can
                reach your account. Revoke any device you do not recognise. If
                you see a sign-in you cannot explain, change your password and
                revoke every other device.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
