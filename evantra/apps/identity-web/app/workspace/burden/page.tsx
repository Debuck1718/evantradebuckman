"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  assessBurden,
  defaultBurdenSnapshot,
  type BurdenSnapshot,
} from "../lib/intelligence";
import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";

const fields: Array<{ key: keyof BurdenSnapshot; label: string; min: number; max: number; step?: number }> = [
  { key: "openTasks", label: "Open tasks", min: 0, max: 50 },
  { key: "blockedTasks", label: "Blocked tasks", min: 0, max: 20 },
  { key: "overdueTasks", label: "Overdue tasks", min: 0, max: 20 },
  { key: "meetingsMinutesToday", label: "Meeting minutes today", min: 0, max: 720, step: 15 },
  { key: "focusMinutesToday", label: "Deep focus minutes today", min: 0, max: 600, step: 15 },
  { key: "recoveryMinutesToday", label: "Recovery minutes today", min: 0, max: 300, step: 15 },
  { key: "commitmentsDueSoon", label: "Commitments due in 72h", min: 0, max: 30 },
];

export default function WorkspaceBurdenPage() {
  const { account, session, loading } = useIdentitySession();

  const [snapshot, setSnapshot] = useState<BurdenSnapshot>(defaultBurdenSnapshot);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assessment = useMemo(() => assessBurden(snapshot), [snapshot]);

  useEffect(() => {
    async function loadFromApi(accountId: string): Promise<void> {
      try {
        setBusy(true);
        setError(null);

        const response = await fetch(`/api/workspace/burden?accountId=${encodeURIComponent(accountId)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load burden data.");
        }

        const payload = (await response.json()) as { snapshot: BurdenSnapshot };
        setSnapshot(payload.snapshot);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load burden data.");
      } finally {
        setBusy(false);
      }
    }

    if (account?.id) {
      void loadFromApi(account.id);
    }
  }, [account?.id]);

  const bandColor =
    assessment.band === "critical"
      ? "text-red-300"
      : assessment.band === "high"
      ? "text-amber-200"
      : assessment.band === "moderate"
      ? "text-yellow-100"
      : "text-emerald-300";

  function updateField(key: keyof BurdenSnapshot, value: number): void {
    setSaved(false);

    setSnapshot(current => ({
      ...current,
      [key]: Number.isFinite(value) ? value : 0,
    }));
  }

  async function persist(): Promise<void> {
    if (!account?.id) {
      return;
    }

    try {
      setBusy(true);
      setError(null);

      const response = await fetch("/api/workspace/burden", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: account.id,
          snapshot,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save burden data.");
      }

      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save burden data.");
    } finally {
      setBusy(false);
    }
  }

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
            <p className="text-sm text-white/70">Sign in to use workspace burden intelligence.</p>
            <Link href="/login" className="mt-4 inline-block rounded-xl bg-[#e6b24a] px-4 py-2 text-sm font-semibold text-[#06131f]">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">Burden-Aware Operating</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Workload strain assessment</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
            Measure load objectively so your workspace can protect focus and prevent overload before performance drops.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/workspace/hub" className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:text-white">
              Back to hub
            </Link>
            <Link href="/workspace/plan" className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:text-white">
              Open life-work plan
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">Inputs</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map(field => (
                <label key={field.key} className="space-y-2 text-sm text-white/70">
                  <span>{field.label}</span>
                  <input
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step ?? 1}
                    value={snapshot[field.key]}
                    onChange={event => updateField(field.key, Number(event.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => void persist()}
              disabled={busy}
              className="mt-6 rounded-xl bg-[#e6b24a] px-5 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
            >
              {busy ? "Saving..." : "Save burden snapshot"}
            </button>
            {saved && <p className="mt-3 text-sm text-emerald-300/80">Saved to workspace API.</p>}
            {error && <p className="mt-3 text-sm text-red-300/80">{error}</p>}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">Current score</p>
            <p className="mt-2 text-4xl font-semibold">{assessment.score}</p>
            <p className={`mt-2 text-sm font-semibold uppercase tracking-[0.14em] ${bandColor}`}>{assessment.band}</p>

            <div className="mt-6">
              <p className="text-sm font-semibold">Why this score</p>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                {assessment.reasons.length > 0 ? (
                  assessment.reasons.map(item => <li key={item}>- {item}</li>)
                ) : (
                  <li>- No overload signal detected.</li>
                )}
              </ul>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold">Recommendations</p>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                {assessment.recommendations.map(item => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
