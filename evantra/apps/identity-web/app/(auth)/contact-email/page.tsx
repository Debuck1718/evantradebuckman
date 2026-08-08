"use client";

import Link from "next/link";
import {
  FormEvent,
  useState,
} from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  requestContactEmailChange,
} from "../../lib/api";

import {
  useIdentitySession,
} from "../../../components/identity/IdentitySessionProvider";

export default function ContactEmailPage() {
  const {
    account,
    session,
    loading: sessionLoading,
  } = useIdentitySession();

  const [newContactEmail, setNewContactEmail] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const email =
      newContactEmail.trim().toLowerCase();

    if (!session?.sessionId) {
      setError(
        "Your session has expired. Please sign in again.",
      );
      return;
    }

    if (!email) {
      setError(
        "Enter your new contact email.",
      );
      return;
    }

    if (!currentPassword) {
      setError(
        "Enter your current password.",
      );
      return;
    }

    if (
      account?.contactEmail &&
      email ===
        account.contactEmail.toLowerCase()
    ) {
      setError(
        "Your new email must be different from your current contact email.",
      );
      return;
    }

    setLoading(true);

    try {
      await requestContactEmailChange({
        sessionId:
          session.sessionId,

        currentPassword,

        newContactEmail:
          email,
      });

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to request a contact email change.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (sessionLoading) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2
            size={28}
            className="animate-spin text-[#e6b24a]"
          />
        </div>
      </main>
    );
  }

  if (!account || !session) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-6">
          <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <ShieldCheck
              size={34}
              className="mx-auto text-[#e6b24a]"
            />

            <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
              Evantra Identity
            </p>

            <h1 className="mt-3 text-2xl font-semibold">
              Sign in required
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Sign in to manage your contact email.
            </p>

            <Link
              href="/login"
              className="mt-7 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
            >
              Sign in
            </Link>
          </section>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-lg items-center px-6 py-12">
          <section className="w-full text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
              <CheckCircle2
                size={28}
                className="text-[#e6b24a]"
              />
            </div>

            <p className="mt-7 text-xs font-medium uppercase tracking-[0.24em] text-[#e6b24a]">
              Evantra Identity
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Check your email
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/50">
              We&apos;ve sent a verification link to
              your new contact email. Open the email
              and follow the verification instructions
              to complete the change.
            </p>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
              <p className="text-xs uppercase tracking-[0.16em] text-white/30">
                New contact email
              </p>

              <p className="mt-2 break-all text-sm text-white/80">
                {newContactEmail.trim().toLowerCase()}
              </p>
            </div>

            <p className="mt-5 text-xs leading-5 text-white/35">
              The email verification request is
              temporary. If it expires, you can return
              here and request another verification
              email.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setCurrentPassword("");
                  setError("");
                }}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                Request another change
              </button>

              <Link
                href="/account"
                className="rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
              >
                Return to account
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto min-h-screen max-w-lg px-6 py-10">
        <header className="mb-12 flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to account
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
              <ShieldCheck
                size={20}
                className="text-[#e6b24a]"
              />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[0.22em]">
                EVANTRA
              </p>

              <p className="text-[9px] uppercase tracking-[0.2em] text-white/35">
                Identity
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
            Account security
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">
            Change contact email
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/50">
            Update the email address associated with
            your Evantra Identity. You&apos;ll need your
            current password and must verify the new
            email address.
          </p>
        </section>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-white/30">
            Current contact email
          </p>

          <p className="mt-2 break-all text-sm text-white/75">
            {account.contactEmail}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl"
        >
          <label
            htmlFor="newContactEmail"
            className="text-xs font-medium uppercase tracking-[0.16em] text-white/40"
          >
            New contact email
          </label>

          <div className="relative mt-3">
            <Mail
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              id="newContactEmail"
              name="newContactEmail"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={newContactEmail}
              onChange={(event) => {
                setNewContactEmail(
                  event.target.value,
                );

                if (error) {
                  setError("");
                }
              }}
              placeholder="new@example.com"
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/60 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <label
            htmlFor="currentPassword"
            className="mt-6 block text-xs font-medium uppercase tracking-[0.16em] text-white/40"
          >
            Current password
          </label>

          <div className="relative mt-3">
            <input
              id="currentPassword"
              name="currentPassword"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(
                  event.target.value,
                );

                if (error) {
                  setError("");
                }
              }}
              placeholder="Enter your current password"
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-4 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/60 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="button"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowPassword(
                  (value) => !value,
                )
              }
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/30 transition hover:text-white/70 disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-5 text-red-300"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Sending verification...
              </>
            ) : (
              "Send verification email"
            )}
          </button>
        </form>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/35">
            Security
          </p>

          <p className="mt-2 text-xs leading-5 text-white/35">
            Your current password is verified by the
            Evantra Identity service. The new email
            address does not become active until it has
            been verified.
          </p>
        </div>

        <p className="mt-8 text-center text-[11px] leading-5 text-white/25">
          Evantra Identity protects access to your
          identity across the Evantra ecosystem.
        </p>
      </div>
    </main>
  );
}