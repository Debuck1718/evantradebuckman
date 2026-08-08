"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Laptop,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Monitor,
  Globe2,
  XCircle,
} from "lucide-react";

import {
  listBrowserSessions,
  revokeBrowserSession,
  revokeAllBrowserSessions,
  rotateBrowserSession,
  touchBrowserSession,
  terminateBrowserSession,
  BrowserSessionResponse,
} from "../../lib/api";

import {
  useIdentitySession,
} from "../../../components/identity/IdentitySessionProvider";

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}

function getDeviceIcon(
  session: BrowserSessionResponse,
) {
  const value = JSON.stringify(session)
    .toLowerCase();

  if (
    value.includes("mobile") ||
    value.includes("android") ||
    value.includes("iphone") ||
    value.includes("ios")
  ) {
    return Smartphone;
  }

  if (
    value.includes("tablet") ||
    value.includes("ipad")
  ) {
    return Monitor;
  }

  return Laptop;
}

function isRevoked(
  session: BrowserSessionResponse,
): boolean {
  return (
    Boolean(session.revokedAt) ||
    Boolean(session.lifecycle?.revoked)
  );
}

function isTerminated(
  session: BrowserSessionResponse,
): boolean {
  return (
    Boolean(session.terminatedAt) ||
    Boolean(session.lifecycle?.terminated)
  );
}

function isExpired(
  session: BrowserSessionResponse,
): boolean {
  const expiresAt =
    new Date(session.expiresAt).getTime();

  return (
    !Number.isNaN(expiresAt) &&
    expiresAt <= Date.now()
  );
}

function sessionStatus(
  session: BrowserSessionResponse,
): string {
  if (isTerminated(session)) {
    return "Terminated";
  }

  if (isRevoked(session)) {
    return "Revoked";
  }

  if (isExpired(session)) {
    return "Expired";
  }

  return "Active";
}

export default function SecurityPage() {
  const {
    account,
    session,
    loading: identityLoading,
  } = useIdentitySession();

  const [sessions, setSessions] = useState<
    BrowserSessionResponse[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [confirmRevokeAll, setConfirmRevokeAll] =
    useState(false);

  const currentSessionId =
    session?.sessionId ?? "";

  const loadSessions =
    useCallback(async () => {
      if (!currentSessionId) {
        setSessions([]);
        setLoading(false);
        return;
      }

      try {
        setError("");

        const result =
          await listBrowserSessions(
            currentSessionId,
          );

        setSessions(
          Array.isArray(result.sessions)
            ? result.sessions
            : [],
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load active sessions.",
        );
      } finally {
        setLoading(false);
      }
    }, [currentSessionId]);

  useEffect(() => {
    if (!identityLoading) {
      void loadSessions();
    }
  }, [
    identityLoading,
    loadSessions,
  ]);

  // Keep the current browser session active
  // whenever the security page becomes visible.
  useEffect(() => {
    if (!currentSessionId) {
      return;
    }

    const handleVisibility =
      async () => {
        if (
          document.visibilityState !==
          "visible"
        ) {
          return;
        }

        try {
          await touchBrowserSession(
            currentSessionId,
          );

          await loadSessions();
        } catch {
          // Do not interrupt the page simply
          // because a background touch failed.
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibility,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility,
      );
    };
  }, [
    currentSessionId,
    loadSessions,
  ]);

  const activeSessions = useMemo(
    () =>
      sessions.filter(
        (item) =>
          !isRevoked(item) &&
          !isTerminated(item) &&
          !isExpired(item),
      ),
    [sessions],
  );

  const currentSession =
    sessions.find(
      (item) =>
        item.sessionId ===
        currentSessionId,
    );

  async function handleRevoke(
    targetSessionId: string,
  ) {
    setActionLoading(
      `revoke:${targetSessionId}`,
    );

    setError("");
    setSuccess("");

    try {
      await revokeBrowserSession(
        targetSessionId,
      );

      if (
        targetSessionId ===
        currentSessionId
      ) {
        setSuccess(
          "This session has been revoked.",
        );
      } else {
        setSuccess(
          "The selected session has been revoked.",
        );
      }

      await loadSessions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to revoke this session.",
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRevokeAllOthers() {
    if (!account?.evantraId) {
      return;
    }

    setActionLoading("revoke-all");

    setError("");
    setSuccess("");

    try {
      const result =
        await revokeAllBrowserSessions(
          account.evantraId,
          currentSessionId,
        );

      setConfirmRevokeAll(false);

      setSuccess(
        `${result.revoked} other session${
          result.revoked === 1
            ? ""
            : "s"
        } revoked.`,
      );

      await loadSessions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to revoke other sessions.",
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRotate() {
    if (!currentSessionId) {
      return;
    }

    setActionLoading("rotate");

    setError("");
    setSuccess("");

    try {
      const result =
        await rotateBrowserSession(
          currentSessionId,
        );

      setSuccess(
        "Your security session has been rotated successfully.",
      );

      /*
       * The backend creates a replacement session.
       *
       * The identity session provider should ideally
       * adopt result.session.sessionId.
       *
       * We reload the list immediately so the UI
       * reflects the backend state.
       */
      if (result.session) {
        setSessions((current) => [
          ...current.filter(
            (item) =>
              item.sessionId !==
              currentSessionId,
          ),
          result.session,
        ]);
      }

      await loadSessions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to rotate your security session.",
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleTerminate(
    targetSessionId: string,
  ) {
    setActionLoading(
      `terminate:${targetSessionId}`,
    );

    setError("");
    setSuccess("");

    try {
      await terminateBrowserSession(
        targetSessionId,
      );

      setSuccess(
        "The selected session has been terminated.",
      );

      await loadSessions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to terminate this session.",
      );
    } finally {
      setActionLoading(null);
    }
  }

  if (identityLoading) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2
            className="animate-spin text-[#e6b24a]"
            size={28}
          />
        </div>
      </main>
    );
  }

  if (!account || !session) {
    return (
      <main className="min-h-screen bg-[#06131f] px-6 py-16 text-white">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <ShieldCheck
              size={38}
              className="mx-auto text-[#e6b24a]"
            />

            <h1 className="mt-5 text-2xl font-semibold">
              Sign in required
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Sign in to manage your Evantra
              Identity security and active
              sessions.
            </p>

            <Link
              href="/login"
              className="mt-7 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-8 md:py-14">

        {/* Header */}
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
              <ShieldCheck
                size={22}
                className="text-[#e6b24a]"
              />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[0.22em]">
                EVANTRA
              </p>

              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Identity Security
              </p>
            </div>
          </div>

          <Link
            href="/identity/auth/account"
            className="text-sm text-white/50 transition hover:text-white"
          >
            Back to account
          </Link>
        </header>

        {/* Intro */}
        <section className="mt-10">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
            Security
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Protect your Identity
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">
            Review the browsers and devices that
            currently have access to your Evantra
            Identity. Revoke sessions you no
            longer recognize.
          </p>
        </section>

        {/* Feedback */}
        <div className="mt-8 space-y-3">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
            >
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300"
            >
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Security overview */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-white/30">
              Active sessions
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {activeSessions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-white/30">
              Current session
            </p>

            <p className="mt-3 text-lg font-medium text-[#e6b24a]">
              {currentSession
                ? "Protected"
                : "Active"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-white/30">
              Identity
            </p>

            <p className="mt-3 truncate text-sm font-medium">
              {account.evantraId}
            </p>
          </div>
        </section>

        {/* Current session controls */}
        <section className="mt-8 rounded-3xl border border-[#e6b24a]/20 bg-[#e6b24a]/[0.04] p-6 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e6b24a]/10">
                  <ShieldCheck
                    size={17}
                    className="text-[#e6b24a]"
                  />
                </span>

                <p className="text-sm font-semibold">
                  Current browser session
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-white/45">
                This is the session currently being
                used to manage your Evantra Identity.
              </p>

              <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/25">
                    Expires
                  </p>

                  <p className="mt-1 text-white/70">
                    {formatDate(
                      session.expiresAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/25">
                    Idle timeout
                  </p>

                  <p className="mt-1 text-white/70">
                    {formatDate(
                      session.idleTimeoutAt,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRotate}
              disabled={
                actionLoading !== null
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/70 transition hover:border-[#e6b24a]/30 hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading === "rotate" ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw size={16} />
              )}

              Refresh security session
            </button>
          </div>
        </section>

        {/* Sessions */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                Access management
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Active sessions
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Devices and browsers associated with
                your Evantra Identity.
              </p>
            </div>

            {activeSessions.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setConfirmRevokeAll(true)
                }
                disabled={
                  actionLoading !== null
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-400/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut size={16} />
                Sign out other sessions
              </button>
            )}
          </div>

          {loading ? (
            <div className="mt-6 flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] py-16">
              <div className="flex items-center gap-3 text-sm text-white/40">
                <Loader2
                  size={20}
                  className="animate-spin text-[#e6b24a]"
                />

                Loading sessions...
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <Globe2
                size={30}
                className="mx-auto text-white/20"
              />

              <p className="mt-4 text-sm text-white/50">
                No browser sessions were returned.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {sessions.map((item) => {
                const DeviceIcon =
                  getDeviceIcon(item);

                const isCurrent =
                  item.sessionId ===
                  currentSessionId;

                const status =
                  sessionStatus(item);

                const revokeKey =
                  `revoke:${item.sessionId}`;

                const terminateKey =
                  `terminate:${item.sessionId}`;

                const disabled =
                  actionLoading !== null ||
                  isRevoked(item) ||
                  isTerminated(item);

                return (
                  <article
                    key={
                      item.sessionId
                    }
                    className={`rounded-3xl border p-6 ${
                      isCurrent
                        ? "border-[#e6b24a]/20 bg-[#e6b24a]/[0.03]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                          <DeviceIcon
                            size={20}
                            className="text-white/60"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold">
                              {isCurrent
                                ? "This device"
                                : "Browser session"}
                            </h3>

                            {isCurrent && (
                              <span className="rounded-full border border-[#e6b24a]/20 bg-[#e6b24a]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#e6b24a]">
                                Current
                              </span>
                            )}

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                                status ===
                                "Active"
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : "bg-white/5 text-white/40"
                              }`}
                            >
                              {status}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-3 text-sm text-white/45 sm:grid-cols-2">
                            <div className="flex items-start gap-2">
                              <Clock3
                                size={15}
                                className="mt-0.5 shrink-0"
                              />

                              <span>
                                <span className="block text-xs text-white/25">
                                  Expires
                                </span>

                                {formatDate(
                                  item.expiresAt,
                                )}
                              </span>
                            </div>

                            <div className="flex items-start gap-2">
                              <Clock3
                                size={15}
                                className="mt-0.5 shrink-0"
                              />

                              <span>
                                <span className="block text-xs text-white/25">
                                  Idle timeout
                                </span>

                                {formatDate(
                                  item.idleTimeoutAt,
                                )}
                              </span>
                            </div>

                            {item.lastActivityAt && (
                              <div className="flex items-start gap-2">
                                <RefreshCw
                                  size={15}
                                  className="mt-0.5 shrink-0"
                                />

                                <span>
                                  <span className="block text-xs text-white/25">
                                    Last activity
                                  </span>

                                  {formatDate(
                                    item.lastActivityAt,
                                  )}
                                </span>
                              </div>
                            )}

                            {item.authenticatedAt && (
                              <div className="flex items-start gap-2">
                                <CheckCircle2
                                  size={15}
                                  className="mt-0.5 shrink-0"
                                />

                                <span>
                                  <span className="block text-xs text-white/25">
                                    Authenticated
                                  </span>

                                  {formatDate(
                                    item.authenticatedAt,
                                  )}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="mt-4 break-all text-[11px] text-white/20">
                            Session ID:{" "}
                            {item.sessionId}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2 lg:flex-col">
                        {!isCurrent && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleRevoke(
                                  item.sessionId,
                                )
                              }
                              disabled={disabled}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-xs font-medium text-red-300 transition hover:bg-red-400/5 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {actionLoading ===
                              revokeKey ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <LogOut
                                  size={14}
                                />
                              )}

                              Revoke
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleTerminate(
                                  item.sessionId,
                                )
                              }
                              disabled={disabled}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {actionLoading ===
                              terminateKey ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <XCircle
                                  size={14}
                                />
                              )}

                              Terminate
                            </button>
                          </>
                        )}

                        {isCurrent && (
                          <span className="px-2 py-2 text-xs text-white/30">
                            Current session
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Security information */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
          <div className="flex gap-4">
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-[#e6b24a]"
            />

            <div>
              <h2 className="text-sm font-semibold">
                Session security
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Evantra Identity uses browser session
                lifecycle controls to protect access.
                You can revoke sessions you no longer
                recognize and rotate your current
                session when needed.
              </p>
            </div>
          </div>
        </section>

        {/* Footer navigation */}
        <div className="mt-10 flex flex-wrap gap-5 border-t border-white/10 pt-7">
          <Link
            href="/identity/auth/account"
            className="text-sm text-white/40 transition hover:text-white"
          >
            Account
          </Link>

          <Link
            href="/identity/auth/contact-email"
            className="text-sm text-white/40 transition hover:text-white"
          >
            Contact email
          </Link>

          <Link
            href="/identity/auth/security"
            className="text-sm text-[#e6b24a]"
          >
            Security
          </Link>
        </div>
      </div>

      {/* Revoke all confirmation */}
      {confirmRevokeAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="revoke-all-title"
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#081925] p-7 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/5">
              <LogOut
                size={20}
                className="text-red-300"
              />
            </div>

            <h2
              id="revoke-all-title"
              className="mt-5 text-xl font-semibold"
            >
              Sign out other sessions?
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/45">
              Every other active browser session
              associated with your Evantra Identity
              will be revoked. Your current session
              will remain active.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={
                  handleRevokeAllOthers
                }
                disabled={
                  actionLoading ===
                  "revoke-all"
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-400/90 px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-red-300 disabled:opacity-60"
              >
                {actionLoading ===
                "revoke-all" ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : null}

                Revoke other sessions
              </button>

              <button
                type="button"
                onClick={() =>
                  setConfirmRevokeAll(false)
                }
                disabled={
                  actionLoading !== null
                }
                className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/60 transition hover:bg-white/[0.04] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}