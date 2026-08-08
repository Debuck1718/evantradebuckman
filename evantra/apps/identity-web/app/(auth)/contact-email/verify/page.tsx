"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  verifyContactEmailChange,
} from "../../../lib/api";

type VerificationState =
  | "loading"
  | "success"
  | "error";

export default function VerifyContactEmailPage() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [state, setState] =
    useState<VerificationState>("loading");

  const [message, setMessage] =
    useState("");

  const [email, setEmail] =
    useState<string | null>(null);

  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    async function verify() {
      if (!token?.trim()) {
        setState("error");
        setMessage(
          "This verification link is missing its verification token.",
        );
        return;
      }

      try {
        const result =
          await verifyContactEmailChange(
            token.trim(),
          );

        setEmail(
          result.account?.contactEmail ??
            null,
        );

        setState("success");

        setMessage(
          result.message ??
            "Your contact email has been successfully updated.",
        );
      } catch (error) {
        setState("error");

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify your contact email.",
        );
      }
    }

    void verify();
  }, [token]);

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-6 py-12">
        <section className="w-full">
          {/* ======================================================
              Header
          ====================================================== */}

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

          {/* ======================================================
              Loading
          ====================================================== */}

          {state === "loading" && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
                <Loader2
                  size={30}
                  className="animate-spin text-[#e6b24a]"
                />
              </div>

              <p className="mt-7 text-xs font-medium uppercase tracking-[0.24em] text-[#e6b24a]">
                Evantra Identity
              </p>

              <h1 className="mt-3 text-3xl font-semibold">
                Verifying your email
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/50">
                Please wait while we securely verify
                your contact email.
              </p>
            </div>
          )}

          {/* ======================================================
              Success
          ====================================================== */}

          {state === "success" && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                <CheckCircle2
                  size={32}
                  className="text-emerald-300"
                />
              </div>

              <p className="mt-7 text-xs font-medium uppercase tracking-[0.24em] text-[#e6b24a]">
                Evantra Identity
              </p>

              <h1 className="mt-3 text-3xl font-semibold">
                Email verified
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/50">
                {message}
              </p>

              {email && (
                <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/30">
                    New contact email
                  </p>

                  <p className="mt-2 break-all text-sm text-white/80">
                    {email}
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/account"
                  className="rounded-xl bg-[#e6b24a] px-5 py-3.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
                >
                  Return to account
                </Link>

                <Link
                  href="/identity/auth/security"
                  className="rounded-xl border border-white/10 px-5 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                >
                  Security settings
                </Link>
              </div>
            </div>
          )}

          {/* ======================================================
              Error
          ====================================================== */}

          {state === "error" && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
                <XCircle
                  size={32}
                  className="text-red-300"
                />
              </div>

              <p className="mt-7 text-xs font-medium uppercase tracking-[0.24em] text-[#e6b24a]">
                Evantra Identity
              </p>

              <h1 className="mt-3 text-3xl font-semibold">
                Verification failed
              </h1>

              <p
                role="alert"
                className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/50"
              >
                {message}
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/30">
                  What you can do
                </p>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-white/45">
                  <li>
                    • Make sure you opened the latest
                    verification email.
                  </li>

                  <li>
                    • Verification links may expire.
                  </li>

                  <li>
                    • Request another contact email
                    change from your account.
                  </li>
                </ul>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/identity/auth/contact-email"
                  className="rounded-xl bg-[#e6b24a] px-5 py-3.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
                >
                  Request a new verification
                </Link>

                <Link
                  href="/account"
                  className="rounded-xl border border-white/10 px-5 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                >
                  Return to account
                </Link>
              </div>
            </div>
          )}

          <p className="mt-12 text-center text-[11px] leading-5 text-white/25">
            Evantra Identity protects access to your
            identity across the Evantra ecosystem.
          </p>
        </section>
      </div>
    </main>
  );
}