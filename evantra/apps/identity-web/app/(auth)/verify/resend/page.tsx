"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  CheckCircle2,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  resendVerification,
} from "../../../lib/api";

export default function ResendVerificationPage() {
  const [contactEmail, setContactEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const email =
      contactEmail.trim();

    if (!email) {
      setError(
        "Enter the contact email associated with your Evantra ID.",
      );
      return;
    }

    setLoading(true);

    try {
      await resendVerification({
        contactEmail: email,
      });

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend the verification email.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-10 flex justify-center">
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
                  Identity
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur">

            {success ? (
              <div className="text-center">

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
                  <CheckCircle2
                    size={30}
                    className="text-emerald-400"
                  />
                </div>

                <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
                  Verification email
                </p>

                <h1 className="text-2xl font-semibold">
                  Check your email.
                </h1>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  If an Evantra account is associated
                  with that email address and still
                  requires verification, a new
                  verification email has been sent.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="w-full rounded-xl bg-[#e6b24a] px-5 py-3 text-center text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
                  >
                    Continue to sign in
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setContactEmail("");
                    }}
                    className="w-full rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    Send again
                  </button>
                </div>

              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#e6b24a]/20 bg-[#e6b24a]/10">
                    <Mail
                      size={22}
                      className="text-[#e6b24a]"
                    />
                  </div>

                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
                    Evantra Identity
                  </p>

                  <h1 className="text-3xl font-semibold">
                    Resend verification
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-white/50">
                    Enter the contact email associated
                    with your Evantra ID and we'll send
                    you a new verification link.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="contactEmail"
                      className="mb-2 block text-sm font-medium text-white/80"
                    >
                      Contact email
                    </label>

                    <input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      autoComplete="email"
                      value={contactEmail}
                      onChange={(event) =>
                        setContactEmail(
                          event.target.value,
                        )
                      }
                      placeholder="you@example.com"
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/50 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e] disabled:cursor-not-allowed disabled:opacity-60"
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
                      "Resend verification email"
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-white/40 transition hover:text-white"
                  >
                    Return to sign in
                  </Link>
                </div>
              </>
            )}
          </section>

          <p className="mt-8 text-center text-xs text-white/30">
            Protected by Evantra Identity
          </p>
        </div>
      </div>
    </main>
  );
}