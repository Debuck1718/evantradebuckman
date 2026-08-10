"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  CheckCircle2,
  Clock3,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  useIdentitySession,
} from "../../../components/identity/IdentitySessionProvider";
import { buildIdentityLoginUrl, buildWorkspaceUrl } from "../../lib/surfaceUrls";

import { logout } from "../../lib/api";

export default function AccountPage() {
  const {
    account,
    session,
    loading,
  } = useIdentitySession();
  const signInUrl = buildIdentityLoginUrl(buildWorkspaceUrl("/workspace/account"));

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [logoutError, setLogoutError] =
    useState<string | null>(null);

  /*
   * ----------------------------------------------------
   * Session expiry
   * ----------------------------------------------------
   */

  const sessionExpiry = useMemo(() => {
    if (!session?.expiresAt) {
      return null;
    }

    const date =
      new Date(session.expiresAt);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  }, [session?.expiresAt]);

  const sessionExpired =
    sessionExpiry !== null &&
    sessionExpiry.getTime() <= Date.now();

  /*
   * ----------------------------------------------------
   * Keep browser session state clean
   * ----------------------------------------------------
   */

  useEffect(() => {
    if (sessionExpired) {
      localStorage.removeItem(
        "evantra_session_id",
      );

      localStorage.removeItem(
        "evantra_account",
      );
    }
  }, [sessionExpired]);

  /*
   * ----------------------------------------------------
   * Logout
   * ----------------------------------------------------
   */

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    setLogoutError(null);

    try {
      if (session?.sessionId) {
        await logout(
          session.sessionId,
        );
      }
    } catch (error) {
      console.error(
        "Evantra Identity logout failed:",
        error,
      );

      /*
       * We still clear local authentication
       * state below. A failed logout request
       * should not leave the UI pretending
       * that the user is authenticated.
       */
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Unable to contact Evantra Identity.",
      );
    } finally {
      localStorage.removeItem(
        "evantra_session_id",
      );

      localStorage.removeItem(
        "evantra_account",
      );

      /*
       * Do not leave the account page accessible
       * through the current client state.
       */
      window.location.assign(signInUrl);
    }
  };

  /*
   * ----------------------------------------------------
   * Loading
   * ----------------------------------------------------
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="flex flex-col items-center">
            <Loader2
              size={28}
              className="animate-spin text-[#e6b24a]"
            />

            <p className="mt-4 text-sm text-white/50">
              Loading your Evantra Identity...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ----------------------------------------------------
   * Not authenticated
   * ----------------------------------------------------
   */

  if (!account || !session) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
              <ShieldCheck
                size={26}
                className="text-[#e6b24a]"
              />
            </div>

            <h1 className="mt-7 text-2xl font-semibold">
              Sign in required
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Sign in to access your Evantra
              Identity.
            </p>

            <Link
              href={signInUrl}
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c66b]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ----------------------------------------------------
   * Authenticated account
   * ----------------------------------------------------
   */

  const fullName =
    `${account.firstName} ${account.lastName}`;

  const accountStatus =
    account.status ?? "ACTIVE";

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
        {/* ==================================================
            Header
            ================================================== */}

        <header className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/workspace/account"
            className="flex w-fit items-center gap-3"
          >
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
                Identity
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Signing out...
              </>
            ) : (
              <>
                <LogOut size={16} />

                Sign out
              </>
            )}
          </button>
        </header>

        {/* ==================================================
            Logout error
            ================================================== */}

        {logoutError && (
          <div
            role="alert"
            className="mb-8 rounded-2xl border border-red-400/20 bg-red-400/[0.05] px-5 py-4 text-sm text-red-200"
          >
            <p className="font-medium">
              Sign out encountered an issue.
            </p>

            <p className="mt-1 text-red-200/60">
              You will still be redirected to
              the sign-in page.
            </p>
          </div>
        )}

        {/* ==================================================
            Welcome
            ================================================== */}

        <section className="mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
            Evantra Identity
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome, {account.firstName}.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Your Evantra Identity is connected
            and ready to access the Evantra
            digital ecosystem.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/workspace/hub"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/[0.03] hover:text-white"
            >
              Open workspace hub
            </Link>

            <Link
              href="/workspace/profile"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/[0.03] hover:text-white"
            >
              Manage profile
            </Link>

            <Link
              href="/security"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/[0.03] hover:text-white"
            >
              Security sessions
            </Link>
          </div>
        </section>

        {/* ==================================================
            Identity overview
            ================================================== */}

        <div className="grid gap-5 md:grid-cols-2">
          {/* Evantra ID */}

          <section className="rounded-2xl border border-[#e6b24a]/20 bg-[#e6b24a]/[0.04] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                  Evantra ID
                </p>

                <p className="mt-3 break-all text-xl font-medium text-[#e6b24a]">
                  {account.evantraId}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e6b24a]/20 bg-[#e6b24a]/10">
                <ShieldCheck
                  size={19}
                  className="text-[#e6b24a]"
                />
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/40">
              Your unique identity within the
              Evantra ecosystem.
            </p>
          </section>

          {/* Account status */}

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                  Account status
                </p>

                <p className="mt-3 text-lg font-medium">
                  {accountStatus}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06]">
                <CheckCircle2
                  size={19}
                  className="text-emerald-300"
                />
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/40">
              Your Evantra Identity account
              status.
            </p>
          </section>

          {/* Personal information */}

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <User
                  size={18}
                  className="text-white/60"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                  Personal information
                </p>

                <p className="mt-1 text-sm text-white/40">
                  Your Evantra account name
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-white/30">
                  Full name
                </p>

                <p className="mt-1 text-sm text-white/80">
                  {fullName}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/30">
                  First name
                </p>

                <p className="mt-1 text-sm text-white/80">
                  {account.firstName}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/30">
                  Last name
                </p>

                <p className="mt-1 text-sm text-white/80">
                  {account.lastName}
                </p>
              </div>
            </div>
          </section>

          {/* Contact email */}

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Mail
                  size={18}
                  className="text-white/60"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                  Contact email
                </p>

                <p className="mt-1 text-sm text-white/40">
                  Account communication
                </p>
              </div>
            </div>

            <p className="mt-6 break-all text-base text-white/80">
              {account.contactEmail}
            </p>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Used for verification, account
              recovery, and important Evantra
              Identity communications.
            </p>
          </section>

          {/* Session */}

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:col-span-2">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Clock3
                    size={18}
                    className="text-white/60"
                  />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                    Current session
                  </p>

                  <p className="mt-1 text-sm text-white/40">
                    Your current Evantra Identity
                    session.
                  </p>
                </div>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                  sessionExpired
                    ? "border-red-400/20 bg-red-400/[0.05] text-red-200"
                    : "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    sessionExpired
                      ? "bg-red-300"
                      : "bg-emerald-300"
                  }`}
                />

                {sessionExpired
                  ? "Expired"
                  : "Protected"}
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-white/30">
                  Session ID
                </p>

                <p className="mt-2 break-all font-mono text-xs text-white/50">
                  {session.sessionId}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/30">
                  Expires
                </p>

                <p className="mt-2 text-sm text-white/70">
                  {sessionExpiry
                    ? sessionExpiry.toLocaleString()
                    : "Unavailable"}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ==================================================
            Footer
            ================================================== */}

        <footer className="mt-12 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-3 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <p>
              EVANTRA IDENTITY
            </p>

            <p>
              Secure access infrastructure.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}