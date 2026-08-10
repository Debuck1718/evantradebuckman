"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  type LifeWorkPlan,
} from "../lib/intelligence";
import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";

export default function WorkspacePlanPage() {
  const { account, session, loading } = useIdentitySession();
  const [plan, setPlan] = useState<LifeWorkPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlan(accountId: string): Promise<void> {
      try {
        setError(null);

        const response = await fetch(`/api/workspace/plan?accountId=${encodeURIComponent(accountId)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load life-work plan.");
        }

        const payload = (await response.json()) as { plan: LifeWorkPlan };
        setPlan(payload.plan);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load life-work plan.");
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
          <p className="text-sm text-white/60">Loading identity context...</p>
        </div>
      </main>
    );
  }

  if (!account || !session) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-sm text-white/70">Sign in to generate your workspace plan.</p>
            <Link href="/login" className="mt-4 inline-block rounded-xl bg-[#e6b24a] px-4 py-2 text-sm font-semibold text-[#06131f]">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="min-h-screen bg-[#06131f] text-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <p className="text-sm text-white/60">{error ?? "Generating life-work plan..."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">Life-Work Orchestration</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Generated operating plan</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
            This plan merges burden signals, commitments, and execution focus so users can act with clarity.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/workspace/hub" className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:text-white">
              Back to hub
            </Link>
            <Link href="/workspace/burden" className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:text-white">
              Update burden
            </Link>
            <Link href="/workspace/promises" className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:text-white">
              Update commitments
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">Burden status</p>
            <p className="mt-2 text-4xl font-semibold">{plan.burden.score}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#e6b24a]">{plan.burden.band}</p>

            <h2 className="mt-6 text-lg font-semibold">Guardrails</h2>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              {plan.guardrails.map(item => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">Top focus</h2>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              {plan.topFocus.map(item => (
                <li key={item}>- {item}</li>
              ))}
            </ul>

            <h2 className="mt-6 text-lg font-semibold">Promises due soon</h2>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              {plan.promisesDueSoon.length > 0 ? (
                plan.promisesDueSoon.map(item => (
                  <li key={item.id}>- {item.title}</li>
                ))
              ) : (
                <li>- No urgent commitments due in 72 hours.</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
