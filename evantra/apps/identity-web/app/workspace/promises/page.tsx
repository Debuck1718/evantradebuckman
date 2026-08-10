"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  dueSoonPromises,
  type PromiseStatus,
  type WorkspacePromise,
} from "../lib/intelligence";
import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";

const statuses: readonly PromiseStatus[] = [
  "proposed",
  "active",
  "fulfilled",
  "renegotiated",
  "breached",
  "cancelled",
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

        const response = await fetch(`/api/workspace/promises?accountId=${encodeURIComponent(accountId)}`, {
          cache: "no-store",
        });

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
            <p className="text-sm text-white/70">Sign in to use workspace promise tracking.</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">Promise Graph</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Commitments and accountability</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
            Track what was promised, by when, and how status changed so trust and execution stay visible.
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

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">Add commitment</h2>
            <div className="mt-4 space-y-4">
              <label className="block space-y-2 text-sm text-white/70">
                <span>Title</span>
                <input
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
                  placeholder="Deliver integration checklist"
                />
              </label>

              <label className="block space-y-2 text-sm text-white/70">
                <span>Due date</span>
                <input
                  type="datetime-local"
                  value={dueAt}
                  onChange={event => setDueAt(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
                />
              </label>

              <button
                type="button"
                onClick={() => void submit()}
                disabled={busy}
                className="rounded-xl bg-[#e6b24a] px-5 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
              >
                {busy ? "Saving..." : "Add promise"}
              </button>

              {saved && <p className="text-sm text-emerald-300/80">Saved to workspace API.</p>}
              {error && <p className="text-sm text-red-300/80">{error}</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">Urgency</p>
            <p className="mt-2 text-3xl font-semibold">{dueSoon.length}</p>
            <p className="mt-2 text-sm text-white/60">commitment(s) due within 72 hours.</p>

            <ul className="mt-5 space-y-2 text-sm text-white/60">
              {dueSoon.length > 0 ? (
                dueSoon.map(item => (
                  <li key={item.id}>- {item.title}</li>
                ))
              ) : (
                <li>- No urgent commitments in the next 72 hours.</li>
              )}
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold">All commitments</h2>

          <div className="mt-4 space-y-3">
            {items.length > 0 ? (
              items.map(item => (
                <article key={item.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-xs text-white/45">Due {new Date(item.dueAt).toLocaleString()}</p>
                    </div>

                    <select
                      value={item.status}
                      onChange={event => void setStatus(item.id, event.target.value as PromiseStatus)}
                      disabled={busy}
                      className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-xs text-white"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-white/45">No commitments yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
