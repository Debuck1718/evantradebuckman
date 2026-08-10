"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles, ShieldCheck, Target, BrainCircuit } from "lucide-react";

import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { type LifeWorkPlan } from "../lib/intelligence";

const systemCards = [
  {
    title: "Burden-Aware Operating",
    description:
      "Continuously scores workload strain and protects focus and recovery windows before burnout occurs.",
    icon: BrainCircuit,
  },
  {
    title: "Promise and Accountability Graph",
    description:
      "Tracks every commitment with owners, due times, renegotiations, and fulfillment history.",
    icon: Target,
  },
  {
    title: "Unified Life + Work Planning",
    description:
      "Brings tasks, events, goals, finance, and commitments into one coordinated daily operating view.",
    icon: Sparkles,
  },
];

const starterActions = [
  "Review today burden score and remove one overload source.",
  "Capture your top 3 promises for the next 72 hours.",
  "Protect one 90-minute deep work block on your calendar.",
  "Resolve one blocker before accepting new urgent work.",
];

export default function WorkspaceHubPage() {
  const { account, session, loading } = useIdentitySession();
  const [plan, setPlan] = useState<LifeWorkPlan | null>(null);

  useEffect(() => {
    async function loadPlan(accountId: string): Promise<void> {
      try {
        const response = await fetch(`/api/workspace/plan?accountId=${encodeURIComponent(accountId)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { plan: LifeWorkPlan };
        setPlan(payload.plan);
      } catch {
        setPlan(null);
      }
    }

    if (account?.id) {
      void loadPlan(account.id);
    }
  }, [account?.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <Loader2 size={28} className="animate-spin text-[#e6b24a]" />
        </div>
      </main>
    );
  }

  if (!account || !session) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
          <section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <ShieldCheck size={34} className="mx-auto text-[#e6b24a]" />
            <h1 className="mt-6 text-2xl font-semibold">Sign in required</h1>
            <p className="mt-3 text-sm text-white/50">Sign in to access the Evantra workspace hub.</p>
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
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <header className="mb-10 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(230,178,74,0.14),rgba(7,24,38,0.7))] p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">Evantra Workspace OS</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Run life and work from one intelligent system.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65 md:text-base">
            Welcome {account.firstName}. Your workspace is now anchored by burden intelligence, promise accountability,
            and life-work orchestration so your day stays effective and sustainable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/workspace/account"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/[0.03] hover:text-white"
            >
              Identity account
            </Link>
            <Link
              href="/workspace/applications"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/[0.03] hover:text-white"
            >
              Connected applications
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {systemCards.map(card => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02]">
                  <Icon size={18} className="text-[#e6b24a]" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/55">{card.description}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">Burden score</p>
            <p className="mt-2 text-4xl font-semibold">{plan?.burden.score ?? "-"}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#e6b24a]">{plan?.burden.band ?? "loading"}</p>
            <Link href="/workspace/burden" className="mt-4 inline-block text-sm text-[#e6b24a] hover:text-[#f0c261]">
              Update workload inputs
            </Link>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">Promises due soon</p>
            <p className="mt-2 text-4xl font-semibold">{plan?.promisesDueSoon.length ?? "-"}</p>
            <p className="mt-2 text-sm text-white/60">Commitments due in 72 hours</p>
            <Link href="/workspace/promises" className="mt-4 inline-block text-sm text-[#e6b24a] hover:text-[#f0c261]">
              Manage commitments
            </Link>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">Execution plan</p>
            <p className="mt-2 text-lg font-semibold">Unified life-work view</p>
            <p className="mt-2 text-sm text-white/60">Generate guardrails and top focus actions from burden and promises.</p>
            <Link href="/workspace/plan" className="mt-4 inline-block text-sm text-[#e6b24a] hover:text-[#f0c261]">
              Open plan
            </Link>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-lg font-semibold">Launch checklist</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            {starterActions.map(action => (
              <li key={action}>- {action}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
