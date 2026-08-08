"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { changePassword } from "../../lib/api";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword === currentPassword) {
      setError(
        "Your new password must be different from your current password.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await changePassword(
        currentPassword,
        newPassword,
      );

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to change your password.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-12">
          <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
              <CheckCircle2
                size={28}
                className="text-emerald-300"
              />
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.24em] text-[#e6b24a]">
              Evantra Identity
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Password updated
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/50">
              Your Evantra Identity password has been
              changed successfully.
            </p>

            <div className="mt-7 rounded-2xl border border-white/10 bg-black/10 p-4 text-left">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-[#e6b24a]"
                />

                <div>
                  <p className="text-sm font-medium text-white/80">
                    Your account is protected
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Use your new password the next time
                    you authenticate with Evantra Identity.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/identity/account"
                className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                Back to account
              </Link>

              <Link
                href="/identity/security"
                className="flex-1 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
              >
                Security settings
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto min-h-screen w-full max-w-2xl px-6 py-8 sm:py-12">
        <header className="mb-12 flex items-center justify-between">
          <Link
            href="/identity/account"
            className="flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
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

            <div className="hidden sm:block">
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
            Security
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">
            Change password
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/50">
            Update the password protecting your Evantra
            Identity.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl"
        >
          <div className="mb-6 rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="flex items-start gap-3">
              <KeyRound
                size={18}
                className="mt-0.5 shrink-0 text-[#e6b24a]"
              />

              <div>
                <p className="text-sm font-medium text-white/80">
                  Keep your password private
                </p>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  Evantra will never ask you to share your
                  password with another person.
                </p>
              </div>
            </div>
          </div>

          <PasswordField
            id="currentPassword"
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            visible={showCurrent}
            setVisible={setShowCurrent}
            autoComplete="current-password"
            disabled={loading}
          />

          <div className="mt-5">
            <PasswordField
              id="newPassword"
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNew}
              setVisible={setShowNew}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div className="mt-5">
            <PasswordField
              id="confirmPassword"
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirm}
              setVisible={setShowConfirm}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <p className="text-xs leading-5 text-white/35">
              Use at least 8 characters. A longer password
              with a mix of letters, numbers, and symbols is
              recommended.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-5 text-red-300"
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
                Updating password...
              </>
            ) : (
              "Update password"
            )}
          </button>
        </form>

        <div className="mt-7 text-center">
          <p className="text-sm text-white/40">
            Forgot your current password?{" "}
            <Link
              href="/identity/auth/forgot-password"
              className="font-medium text-[#e6b24a] hover:text-[#f0c261]"
            >
              Recover your account
            </Link>
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

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
  autoComplete: string;
  disabled: boolean;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  setVisible,
  autoComplete,
  disabled,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-[0.16em] text-white/40"
      >
        {label}
      </label>

      <div className="relative mt-3">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-4 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/60 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          disabled={disabled}
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
}