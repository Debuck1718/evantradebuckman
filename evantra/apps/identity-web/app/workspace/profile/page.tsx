"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { GlassCard } from "../../../components/ui/GlassCard";
import { EvantraBrandIcon } from "../../../components/brand/EvantraBrandIcon";

export default function ProfilePage() {
  const { account, session, loading } = useIdentitySession();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
          <Loader2 size={32} className="animate-spin text-[#e6b24a]" />
        </div>
      </main>
    );
  }

  if (!account || !session) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
          <GlassCard variant="elevated" className="w-full p-8 text-center sm:p-10">
            <EvantraBrandIcon size={48} className="mx-auto" />
            <h1 className="mt-6 text-2xl font-semibold">Sign in required</h1>
            <p className="mt-3 text-sm text-white/50">
              Sign in to manage your identity profile.
            </p>
            <Link
              href="/login"
              className="mt-7 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
            >
              Sign in
            </Link>
          </GlassCard>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-8 md:py-14">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
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
                Profile Management
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Identity &amp; Profile Settings
            </h1>
          </div>

          <Link
            href="/workspace/account"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition hover:border-[#e6b24a]/40 hover:text-[#fae59a]"
          >
            <ShieldCheck size={14} className="text-[#e6b24a]" />
            Account Overview
          </Link>
        </div>

        {/* Profile Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Identity Profile Card */}
          <GlassCard variant="gold" className="p-7 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
                  <User size={20} className="text-[#fae59a]" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">
                    Identity Profile
                  </h2>
                  <p className="text-xs text-white/45">
                    Unified Evantra ID master record
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                <CheckCircle2 size={11} />
                Verified
              </span>
            </div>

            <div className="mt-7 space-y-4 text-sm">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Evantra ID
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#fae59a] break-all">
                  {account.evantraId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    First Name
                  </p>
                  <p className="mt-1 font-medium text-white">
                    {account.firstName}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-wider text-white/35">
                    Last Name
                  </p>
                  <p className="mt-1 font-medium text-white">
                    {account.lastName}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Contact Profile Card */}
          <GlassCard variant="default" className="p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Mail size={20} className="text-white/70" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">
                    Primary Contact Email
                  </h2>
                  <p className="text-xs text-white/45">
                    Communications &amp; cryptographic recovery
                  </p>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-white/35">
                  Contact Address
                </p>
                <p className="mt-1 font-mono text-sm text-white/85 break-all">
                  {account.contactEmail}
                </p>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-white/45">
                Used for identity notices, password reset tokens, and emergency recovery.
              </p>
            </div>

            <Link
              href="/contact-email"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#e6b24a]/40 hover:text-[#fae59a]"
            >
              Update Contact Email
            </Link>
          </GlassCard>

          {/* Security & Credentials Controls */}
          <GlassCard variant="default" className="p-7 sm:p-8 md:col-span-2">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <KeyRound size={18} className="text-[#e6b24a]" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Cryptographic Security Controls
                    </h2>
                    <p className="text-xs text-white/50">
                      Manage cryptographic password credentials and active browser sessions
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/security"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <ShieldCheck size={14} className="text-[#e6b24a]" />
                  Active Sessions
                </Link>

                <Link
                  href="/change-password"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e6b24a] px-4 py-2.5 text-xs font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
                >
                  <KeyRound size={14} />
                  Change Password
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
