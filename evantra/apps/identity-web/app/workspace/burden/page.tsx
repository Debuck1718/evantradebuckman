"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Save,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  assessBurden,
  defaultBurdenSnapshot,
  type BurdenSnapshot,
} from "../lib/intelligence";
import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { GlassCard } from "../../../components/ui/GlassCard";

const fields: Array<{
  key: keyof BurdenSnapshot;
  label: string;
  description: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}> = [
  {
    key: "openTasks",
    label: "Open Tasks",
    description: "Active concurrent work items competing for attention.",
    min: 0,
    max: 50,
    unit: "tasks",
  },
  {
    key: "blockedTasks",
    label: "Blocked Tasks",
    description: "Items waiting on external dependencies causing mental drag.",
    min: 0,
    max: 20,
    unit: "tasks",
  },
  {
    key: "overdueTasks",
    label: "Overdue Tasks",
    description: "Delayed milestones contributing to psychological pressure.",
    min: 0,
    max: 20,
    unit: "tasks",
  },
  {
    key: "meetingsMinutesToday",
    label: "Meeting Minutes Today",
    description: "Synchronous scheduled interaction time.",
    min: 0,
    max: 720,
    step: 15,
    unit: "mins",
  },
  {
    key: "focusMinutesToday",
    label: "Deep Focus Minutes",
    description: "Uninterrupted creative problem solving time.",
    min: 0,
    max: 600,
    step: 15,
    unit: "mins",
  },
  {
    key: "recoveryMinutesToday",
    label: "Recovery Minutes",
    description: "Rest, physical detachment, and cognitive recharge windows.",
    min: 0,
    max: 300,
    step: 15,
    unit: "mins",
  },
  {
    key: "commitmentsDueSoon",
    label: "Promises Due in 72h",
    description: "High-stake deliverables due in the next 3 business days.",
    min: 0,
    max: 30,
    unit: "promises",
  },
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

        const response = await fetch(
          `/api/workspace/burden?accountId=${encodeURIComponent(accountId)}`,
          { cache: "no-store" },
        );

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

  const getBandStyles = (band: string) => {
    switch (band) {
      case "critical":
        return {
          textColor: "text-red-300",
          bgColor: "bg-red-400/10 border-red-400/30",
          barColor: "bg-gradient-to-r from-amber-400 to-red-500",
          label: "Critical Strain",
          statusText: "Severe overload risk. Automatic focus guardrails engaged.",
        };
      case "high":
        return {
          textColor: "text-amber-300",
          bgColor: "bg-amber-400/10 border-amber-400/30",
          barColor: "bg-gradient-to-r from-yellow-400 to-amber-500",
          label: "Elevated Load",
          statusText: "Cognitive bandwidth is stretched. Mitigate meetings.",
        };
      case "moderate":
        return {
          textColor: "text-yellow-200",
          bgColor: "bg-yellow-400/10 border-yellow-400/30",
          barColor: "bg-gradient-to-r from-teal-400 to-yellow-400",
          label: "Moderate Activity",
          statusText: "Balanced output with manageable commitments.",
        };
      default:
        return {
          textColor: "text-emerald-300",
          bgColor: "bg-emerald-400/10 border-emerald-400/30",
          barColor: "bg-gradient-to-r from-[#fae59a] to-emerald-400",
          label: "Optimal & Sustainable",
          statusText: "High clarity, minimal cognitive friction.",
        };
    }
  };

  const bandStyles = getBandStyles(assessment.band);

  function updateField(key: keyof BurdenSnapshot, value: number): void {
    setSaved(false);

    setSnapshot((current) => ({
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
            <h1 className="text-2xl font-semibold">Sign in required</h1>
            <p className="mt-3 text-sm text-white/50">
              Sign in to use workspace burden intelligence.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f]"
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
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
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
                Burden Engine
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Cognitive Burden Telemetry
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
              Objectively quantify mental strain and task concurrency. The Evantra Kernel
              proactively guards focus and shields deep-work blocks before burnout degrades output.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/workspace/plan"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#e6b24a]/40 hover:text-[#fae59a]"
            >
              <Sparkles size={14} />
              Open Life-Work Plan
            </Link>
          </div>
        </div>

        {/* Cockpit Grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Workload Inputs */}
          <GlassCard variant="default" className="p-7 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Telemetry Workload Inputs
                </h2>
                <p className="text-xs text-white/50">
                  Update your daily cognitive metrics
                </p>
              </div>

              <button
                type="button"
                onClick={() => void persist()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-[#e6b24a] px-4 py-2 text-xs font-semibold text-[#06131f] shadow-md transition hover:bg-[#f0c261] disabled:opacity-50"
              >
                {busy ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Snapshot
                  </>
                )}
              </button>
            </div>

            {saved && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-xs text-emerald-300">
                <CheckCircle2 size={15} />
                Burden snapshot persisted to workspace telemetry.
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-xs text-red-300">
                <AlertTriangle size={15} />
                {error}
              </div>
            )}

            <div className="mt-6 space-y-5">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-white">
                        {field.label}
                      </span>
                      <p className="text-xs text-white/40">
                        {field.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step ?? 1}
                        value={snapshot[field.key]}
                        onChange={(event) =>
                          updateField(field.key, Number(event.target.value))
                        }
                        className="w-20 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-right font-mono text-sm font-semibold text-[#fae59a] outline-none focus:border-[#e6b24a]"
                      />
                      <span className="w-12 text-xs text-white/40 font-mono">
                        {field.unit}
                      </span>
                    </div>
                  </div>

                  {/* Range Slider for rapid tuning */}
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step ?? 1}
                    value={snapshot[field.key]}
                    onChange={(event) =>
                      updateField(field.key, Number(event.target.value))
                    }
                    className="mt-3 w-full accent-[#e6b24a] bg-white/10 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Real-time Assessment & Recommendations */}
          <div className="space-y-6">
            {/* Live Score Gauge */}
            <GlassCard variant="gold" className="p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit size={18} className="text-[#e6b24a]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Live Burden Score
                  </span>
                </div>

                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${bandStyles.bgColor} ${bandStyles.textColor}`}
                >
                  {bandStyles.label}
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-6xl font-bold tracking-tight text-white">
                  {assessment.score}
                </span>
                <span className="text-sm text-white/40">/ 100 maximum index</span>
              </div>

              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${bandStyles.barColor}`}
                  style={{
                    width: `${Math.min(Math.max(assessment.score, 5), 100)}%`,
                  }}
                />
              </div>

              <p className="mt-4 text-xs leading-relaxed text-white/70">
                {bandStyles.statusText}
              </p>
            </GlassCard>

            {/* Why This Score */}
            <GlassCard variant="default" className="p-6 sm:p-7">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Cognitive Signals Detected
              </h3>

              <div className="mt-4 space-y-2.5">
                {assessment.reasons.length > 0 ? (
                  assessment.reasons.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-white/75"
                    >
                      <Zap size={14} className="text-[#e6b24a] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-white/45 italic">
                    No active overload signals detected. Operating within sustainable boundaries.
                  </p>
                )}
              </div>
            </GlassCard>

            {/* Prescriptive Recommendations */}
            <GlassCard variant="default" className="p-6 sm:p-7">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Kernel Prescriptions
              </h3>

              <div className="mt-4 space-y-2.5">
                {assessment.recommendations.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.02] p-3 text-xs text-white/80"
                  >
                    <CheckCircle2 size={14} className="text-emerald-300 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  );
}
