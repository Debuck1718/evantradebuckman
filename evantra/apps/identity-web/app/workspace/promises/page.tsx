"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import {
  dueSoonPromises,
  type PromiseStatus,
  type WorkspacePromise,
} from "../lib/intelligence";
import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { GlassCard } from "../../../components/ui/GlassCard";

const statuses: readonly { value: PromiseStatus; label: string; badgeColor: string }[] = [
  {
    value: "proposed",
    label: "Proposed",
    badgeColor: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  },
  {
    value: "active",
    label: "Active Commitment",
    badgeColor: "border-[#e6b24a]/30 bg-[#e6b24a]/10 text-[#fae59a]",
  },
  {
    value: "fulfilled",
    label: "Fulfilled",
    badgeColor: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
  {
    value: "renegotiated",
    label: "Renegotiated",
    badgeColor: "border-purple-400/20 bg-purple-400/10 text-purple-300",
  },
  {
    value: "breached",
    label: "Breached",
    badgeColor: "border-red-400/20 bg-red-400/10 text-red-300",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    badgeColor: "border-white/10 bg-white/5 text-white/40",
  },
];

export default function WorkspacePromisesPage() {
  const { account, session, loading } = useIdentitySession();

  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [saved, setSaved] = useState(false);
  const [items, setItems] = useState<WorkspacePromise[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dueSoon = useMemo(() => dueSoonPromises(items), [items]);

  useEffect(() => {
    async function loadFromApi(accountId: string): Promise<void> {
      try {
        setBusy(true);
        setError(null);

        const response = await fetch(
          `/api/workspace/promises?accountId=${encodeURIComponent(accountId)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Unable to load commitments.");
        }

        const payload = (await response.json()) as { items: WorkspacePromise[] };
        setItems(payload.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load commitments.");
      } finally {
        setBusy(false);
      }
    }

    if (account?.id) {
      void loadFromApi(account.id);
    }
  }, [account?.id]);

  async function submit(): Promise<void> {
    if (!title.trim() || !dueAt.trim() || !account?.id) {
      return;
    }

    try {
      setBusy(true);
      setError(null);
      setSaved(false);

      const response = await fetch("/api/workspace/promises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: account.id,
          title,
          dueAt,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to create commitment.");
      }

      const payload = (await response.json()) as { items: WorkspacePromise[] };
      setItems(payload.items);
      setSaved(true);

      setTitle("");
      setDueAt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create commitment.");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id: string, status: PromiseStatus): Promise<void> {
    if (!account?.id) {
      return;
    }

    try {
      setBusy(true);
      setError(null);
      setSaved(false);

      const response = await fetch("/api/workspace/promises", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: account.id,
          id,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update commitment.");
      }

      const payload = (await response.json()) as { items: WorkspacePromise[] };
      setItems(payload.items);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update commitment.");
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
              Sign in to use the workspace promise graph.
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
                Promise Graph
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Promises &amp; Commitments
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
              Track commitments with explicit bilateral accountability, deadlines,
              and renegotiation history. Turn loose todo items into reliable trust contracts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/workspace/plan"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#e6b24a]/40 hover:text-[#fae59a]"
            >
              <Sparkles size={14} />
              Open Operating Plan
            </Link>
          </div>
        </div>

        {/* Creation & Urgency Grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Add Commitment Card */}
          <GlassCard variant="default" className="p-7 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Capture Bilateral Promise
                </h2>
                <p className="text-xs text-white/50">
                  Record a deliverable with an explicit delivery window
                </p>
              </div>

              <span className="rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#fae59a]">
                New Promise
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/70">
                  Commitment Description / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Deliver OAuth SDK security documentation"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/70">
                  Target Due Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={dueAt}
                  onChange={(event) => setDueAt(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#e6b24a]"
                />
              </div>

              <button
                type="button"
                onClick={() => void submit()}
                disabled={busy || !title.trim() || !dueAt.trim()}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] shadow-md transition hover:bg-[#f0c261] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Recording...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Commit to Promise Graph
                  </>
                )}
              </button>

              {saved && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-xs text-emerald-300">
                  <CheckCircle2 size={15} />
                  Promise successfully recorded and synced.
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-xs text-red-300">
                  <AlertTriangle size={15} />
                  {error}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Urgency Window */}
          <div className="space-y-6">
            <GlassCard variant="gold" className="p-7 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[#e6b24a]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    72-Hour Urgency Horizon
                  </span>
                </div>

                <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                  {dueSoon.length} Pending
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-6xl font-bold tracking-tight text-white">
                  {dueSoon.length}
                </span>
                <span className="text-sm text-white/50">due within 72 hours</span>
              </div>

              <div className="mt-6 space-y-2.5">
                {dueSoon.length > 0 ? (
                  dueSoon.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="text-[11px] text-[#fae59a]">
                          Due {new Date(item.dueAt).toLocaleDateString()} at{" "}
                          {new Date(item.dueAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-white/45 italic py-3">
                    No urgent promises requiring immediate fulfillment in the 72-hour window.
                  </p>
                )}
              </div>
            </GlassCard>

            <GlassCard variant="default" className="p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Promise Integrity Rule
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                If a deadline cannot be met, renegotiate proactively rather than letting the
                commitment expire into a breached state.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* All Promises Ledger */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
              <Target size={16} className="text-[#e6b24a]" />
              Accountability Ledger
            </div>
            <span className="text-xs text-white/40">{items.length} Total Commitments</span>
          </div>

          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((item) => {
                const currentStatus =
                  statuses.find((s) => s.value === item.status) ?? statuses[0];

                return (
                  <GlassCard
                    key={item.id}
                    variant="default"
                    className="p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-semibold text-white text-base">
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-white/45">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-[#e6b24a]" />
                            Due {new Date(item.dueAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${currentStatus.badgeColor}`}
                        >
                          {currentStatus.label}
                        </span>

                        <select
                          value={item.status}
                          onChange={(event) =>
                            void setStatus(
                              item.id,
                              event.target.value as PromiseStatus,
                            )
                          }
                          disabled={busy}
                          className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white outline-none transition focus:border-[#e6b24a]"
                        >
                          {statuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </GlassCard>
                );
              })
            ) : (
              <GlassCard variant="default" className="p-8 text-center text-sm text-white/40">
                No promises recorded yet. Use the form above to log your first commitment.
              </GlassCard>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
