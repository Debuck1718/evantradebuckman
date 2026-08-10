"use client";

import Link from "next/link";
import {
  Loader2,
  Mail,
  ShieldCheck,
  User,
  KeyRound,
} from "lucide-react";

import {
  useIdentitySession,
} from "../../../components/identity/IdentitySessionProvider";

export default function ProfilePage() {
  const {
    account,
    session,
    loading,
  } = useIdentitySession();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
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
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
          <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <ShieldCheck
              size={34}
              className="mx-auto text-[#e6b24a]"
            />

            <h1 className="mt-6 text-2xl font-semibold">
              Sign in required
            </h1>

            <p className="mt-3 text-sm text-white/50">
              Sign in to manage your identity profile.
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

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-8 md:py-14">
        <header className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
              Evantra Identity
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Profile management
            </h1>
          </div>

          <Link
            href="/workspace/account"
            className="text-sm text-white/55 transition hover:text-white"
          >
            Back to account
          </Link>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <User
                  size={18}
                  className="text-white/60"
                />
              </div>

              <p className="text-sm font-semibold">
                Identity profile
              </p>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-xs text-white/35">
                  Evantra ID
                </p>
                <p className="mt-1 break-all text-white/80">
                  {account.evantraId}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/35">
                  First name
                </p>
                <p className="mt-1 text-white/80">
                  {account.firstName}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/35">
                  Last name
                </p>
                <p className="mt-1 text-white/80">
                  {account.lastName}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Mail
                  size={18}
                  className="text-white/60"
                />
              </div>

              <p className="text-sm font-semibold">
                Contact profile
              </p>
            </div>

            <p className="mt-6 break-all text-sm text-white/80">
              {account.contactEmail}
            </p>

            <p className="mt-3 text-xs leading-5 text-white/40">
              Update your contact email used for verification,
              recovery, and identity notices.
            </p>

            <Link
              href="/contact-email"
              className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:text-white"
            >
              Change contact email
            </Link>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <KeyRound
                  size={18}
                  className="text-white/60"
                />
              </div>

              <p className="text-sm font-semibold">
                Security controls
              </p>
            </div>

            <p className="mt-4 text-sm text-white/50">
              Manage sessions and password settings for this identity.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/security"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:text-white"
              >
                Session security
              </Link>

              <Link
                href="/change-password"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:text-white"
              >
                Change password
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
