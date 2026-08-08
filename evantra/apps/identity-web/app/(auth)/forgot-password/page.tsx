"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { forgotPassword } from "../../lib/api";

export default function ForgotPasswordPage() {
  const [contactEmail, setContactEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const email = contactEmail.trim();

    if (!email) {
      setError("Enter your contact email.");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process your request.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
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
              Check your email
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/50">
              If an Evantra account is associated with
              that contact email, we&apos;ve sent
              instructions to continue recovering your
              account.
            </p>

            <div className="mt-7 rounded-2xl border border-white/10 bg-black/10 p-4 text-left">
              <p className="text-xs uppercase tracking-[0.16em] text-white/30">
                Contact email
              </p>

              <p className="mt-2 break-all text-sm text-white/80">
                {contactEmail}
              </p>
            </div>

            <p className="mt-5 text-xs leading-5 text-white/35">
              For your security, Evantra does not reveal
              whether an account exists for a submitted
              contact email.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setError("");
                }}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                Try another email
              </button>

              <Link
                href="/login"
                className="rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
              >
                Return to sign in
              </Link>
            </div>
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
              Forgot your password?
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/50">
              Enter the contact email associated with
              your Evantra Identity. If your account can
              be recovered, we&apos;ll send instructions to
              continue.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl"
          >
            <label
              htmlFor="contactEmail"
              className="text-xs font-medium uppercase tracking-[0.16em] text-white/40"
            >
              Contact email
            </label>

            <div className="relative mt-3">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={contactEmail}
                onChange={(event) => {
                  setContactEmail(event.target.value);
                  if (error) {
                    setError("");
                  }
                }}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/60 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
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
                  Sending instructions...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="mt-7 text-center">
            <p className="text-sm text-white/40">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-[#e6b24a] hover:text-[#f0c261]"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-[11px] leading-5 text-white/25">
            Evantra Identity protects access to your
            identity across the Evantra ecosystem.
          </p>
        </section>
      </div>
    </main>
  );
}