"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { resetPassword } from "../../lib/api";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  /*
   * Read the recovery token from:
   *
   * /identity/auth/reset-password?token=...
   *
   * We intentionally do this client-side because
   * this page is a client component.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recoveryToken = params.get("token");

    if (recoveryToken?.trim()) {
      setToken(recoveryToken.trim());
    } else {
      setError(
        "This password recovery link is missing its recovery token.",
      );
    }
  }, []);

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
    }),
    [password],
  );

  const passwordStrong =
    passwordChecks.length &&
    passwordChecks.upper &&
    passwordChecks.lower &&
    passwordChecks.number;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!token) {
      setError(
        "This recovery link is invalid or incomplete.",
      );
      return;
    }

    if (!password) {
      setError("Enter a new password.");
      return;
    }

    if (!passwordStrong) {
      setError(
        "Your new password does not meet the required security requirements.",
      );
      return;
    }

    if (!confirmPassword) {
      setError("Confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        token,
        password,
      });

      setCompleted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset your password.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <main className="min-h-screen bg-[#06131f] px-6 py-10 text-white">
        <div className="mx-auto flex min-h-[85vh] max-w-md items-center justify-center">
          <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
              <CheckCircle2
                size={27}
                className="text-[#e6b24a]"
              />
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.24em] text-[#e6b24a]">
              Evantra Identity
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Password updated
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/50">
              Your Evantra Identity password has been
              changed successfully.
            </p>

            <Link
              href="/login"
              className="mt-8 block rounded-xl bg-[#e6b24a] px-5 py-3.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
            >
              Sign in to Evantra
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06131f] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center justify-center">
        <section className="w-full">
          <header className="mb-10 flex items-center justify-between">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to sign in
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

          <div className="mb-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
              Account recovery
            </p>

            <h1 className="text-4xl font-semibold tracking-tight">
              Create a new password
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/50">
              Choose a new password for your Evantra
              Identity.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl"
          >
            {/* Recovery token status */}
            <div className="rounded-xl border border-white/10 bg-black/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <KeyRound
                  size={16}
                  className={
                    token
                      ? "text-[#e6b24a]"
                      : "text-white/30"
                  }
                />

                <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                  Recovery link
                </p>
              </div>

              <p className="mt-2 text-sm text-white/60">
                {token
                  ? "Recovery token detected."
                  : "Waiting for a valid recovery token..."}
              </p>
            </div>

            <label
              htmlFor="password"
              className="mt-6 block text-xs font-medium uppercase tracking-[0.16em] text-white/40"
            >
              New password
            </label>

            <div className="relative mt-3">
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Create a secure password"
                disabled={loading || !token}
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
                    (current) => !current,
                  )
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/30 transition hover:text-white disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <PasswordRequirement
                valid={passwordChecks.length}
                text="8+ characters"
              />

              <PasswordRequirement
                valid={passwordChecks.upper}
                text="Uppercase letter"
              />

              <PasswordRequirement
                valid={passwordChecks.lower}
                text="Lowercase letter"
              />

              <PasswordRequirement
                valid={passwordChecks.number}
                text="Number"
              />
            </div>

            <label
              htmlFor="confirmPassword"
              className="mt-6 block text-xs font-medium uppercase tracking-[0.16em] text-white/40"
            >
              Confirm password
            </label>

            <div className="relative mt-3">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value,
                  );

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Enter your password again"
                disabled={loading || !token}
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-4 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/60 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                type="button"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirmation password"
                    : "Show confirmation password"
                }
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current,
                  )
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/30 transition hover:text-white disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {confirmPassword &&
              password !== confirmPassword && (
                <p className="mt-3 text-xs text-red-300">
                  Passwords do not match.
                </p>
              )}

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
              disabled={loading || !token}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Updating password...
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] leading-5 text-white/25">
            This recovery link is temporary and can
            only be used according to Evantra Identity
            recovery rules.
          </p>
        </section>
      </div>
    </main>
  );
}

function PasswordRequirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 ${
        valid
          ? "border-[#e6b24a]/20 bg-[#e6b24a]/5 text-[#e6b24a]"
          : "border-white/10 bg-white/[0.02] text-white/30"
      }`}
    >
      {valid ? "✓" : "○"} {text}
    </div>
  );
}