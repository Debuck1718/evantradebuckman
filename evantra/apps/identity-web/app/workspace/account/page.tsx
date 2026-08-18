"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  KeyRound,
  Layers,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

import {
  useIdentitySession,
} from "../../../components/identity/IdentitySessionProvider";

import { logout } from "../../lib/api";
import { GlassCard } from "../../../components/ui/GlassCard";
import { EvantraBrandIcon } from "../../../components/brand/EvantraBrandIcon";

export default function AccountPage() {
  const router = useRouter();

  const {
    account,
    session,
    loading,
  } = useIdentitySession();

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

      router.replace("/login");
      router.refresh();
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
          <Loader2
            size={32}
            className="animate-spin text-[#e6b24a]"
          />
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
        <div className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-6">
          <GlassCard variant="elevated" className="w-full p-8 text-center sm:p-10">
            <EvantraBrandIcon size={48} className="mx-auto" />

            <h1 className="mt-6 text-2xl font-semibold">
              Sign in required
            </h1>

            <p className="mt-3 text-sm text-white/50">
              Sign in to access your Evantra Identity account.
            </p>

            <Link
              href="/login"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
            >
              Sign in
            </Link>
          </GlassCard>
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
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
        {/* ==================================================
            Header
            ================================================== */}

        <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
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
                Identity Account
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Account Infrastructure
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/80 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Signing out...
              </>
            ) : (
              <>
                <LogOut size={14} />
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
              You will still be redirected to the sign-in page.
            </p>
          </div>
        )}

        {/* ==================================================
            Welcome Hero Banner
            ================================================== */}

        <GlassCard
          variant="gold"
          className="mb-10 p-8 sm:p-9 border-[#e6b24a]/25 bg-gradient-to-br from-[#0b4f71]/30 via-[#06131f] to-[#071826]"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#fae59a]">
                  <Zap size={13} className="text-[#e6b24a]" />
                  Master Account Record
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 size={13} />
                  {accountStatus}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Identity Profile for{" "}
                <span className="bg-gradient-to-r from-[#fae59a] via-[#e6b24a] to-[#c99322] bg-clip-text text-transparent">
                  {fullName}
                </span>
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/65 sm:text-sm">
                Your sovereign Evantra ID powers your profile, authenticated sessions,
                cryptographic master keys, and connected developer applications.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link
                href="/workspace/profile"
                className="inline-flex items-center gap-2 rounded-xl bg-[#e6b24a] px-4 py-2.5 text-xs font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
              >
                <User size={14} />
                Manage Profile
              </Link>

              <Link
                href="/security"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#e6b24a]/40 hover:text-[#fae59a]"
              >
                <ShieldCheck size={14} className="text-[#e6b24a]" />
                Security Sessions
              </Link>
            </div>
          </div>
        </GlassCard>

        {/* ==================================================
            Identity overview grid
            ================================================== */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Evantra ID */}
          <GlassCard variant="default" className="p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Evantra ID
                </p>

                <p className="mt-3 break-all font-mono text-xl font-semibold text-[#fae59a]">
                  {account.evantraId}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#e6b24a]/25 bg-[#e6b24a]/10">
                <EvantraBrandIcon size={26} showGlow={false} />
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-white/50">
              Unique, global namespace identifier across all Evantra ecosystem apps and OAuth integrations.
            </p>
          </GlassCard>

          {/* Contact email */}
          <GlassCard variant="default" className="p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Primary Contact Email
                </p>

                <p className="mt-3 break-all font-mono text-base font-medium text-white">
                  {account.contactEmail}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Mail size={18} className="text-white/70" />
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-white/50">
              Secured for multi-factor verification, security alerts, and cryptographic recovery notices.
            </p>
          </GlassCard>

          {/* Cryptographic Session */}
          <GlassCard variant="default" className="p-7 md:col-span-2">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between border-b border-white/10 pb-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Clock3
                    size={18}
                    className="text-white/70"
                  />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">
                    Cryptographic Active Session
                  </h3>

                  <p className="text-xs text-white/45">
                    Hardware-bound browser session protected by Evantra Identity
                  </p>
                </div>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  sessionExpired
                    ? "border-red-400/20 bg-red-400/10 text-red-300"
                    : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    sessionExpired
                      ? "bg-red-400 animate-pulse"
                      : "bg-emerald-400"
                  }`}
                />

                {sessionExpired
                  ? "Expired"
                  : "Protected"}
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Session Token ID
                </p>

                <p className="mt-2 break-all font-mono text-xs text-white/60">
                  {session.sessionId}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Session Expiration Time
                </p>

                <p className="mt-2 text-xs font-medium text-white/80">
                  {sessionExpiry
                    ? sessionExpiry.toLocaleString()
                    : "Unavailable"}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}