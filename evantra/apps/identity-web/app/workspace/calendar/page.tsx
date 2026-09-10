"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, Loader2, Plus } from "lucide-react";

import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { GlassCard } from "../../../components/ui/GlassCard";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  isFocusBlock?: boolean;
}

export default function CalendarPage() {
  const { session, loading } = useIdentitySession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [focusBlock, setFocusBlock] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadEvents(): Promise<void> {
    if (!session) return;
    const response = await fetch("/api/workspace/calendar", {
      cache: "no-store",
      headers: {},
    });
    if (!response.ok) throw new Error("Unable to load calendar.");
    const payload = (await response.json()) as { events: CalendarEvent[] };
    setEvents(payload.events);
  }

  useEffect(() => {
    void loadEvents().catch(() => setError("Unable to load calendar."));
  }, [session]);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!session) return;

    try {
      setBusy(true);
      setError("");
      const response = await fetch("/api/workspace/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, startAt, endAt, focusBlock }),
      });
      const payload = (await response.json()) as { event?: CalendarEvent; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to schedule event.");
      setEvents(current => [...current, payload.event!].sort((a, b) => a.startAt.localeCompare(b.startAt)));
      setTitle("");
      setDescription("");
      setStartAt("");
      setEndAt("");
      setFocusBlock(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to schedule event.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#06131f] text-white"><Loader2 className="animate-spin text-[#e6b24a]" /></main>;
  if (!session) return <main className="flex min-h-screen items-center justify-center bg-[#06131f] px-6 text-white"><GlassCard variant="elevated" className="w-full max-w-md p-8 text-center"><h1 className="text-2xl font-semibold">Sign in required</h1><Link href="/login" className="mt-6 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f]">Sign in</Link></GlassCard></main>;

  return (
    <main className="min-h-screen bg-[#06131f] px-6 py-10 text-white md:px-8 md:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div><div className="flex items-center gap-3 text-[#e6b24a]"><CalendarDays size={22} /><span className="text-xs font-semibold uppercase tracking-[0.24em]">Temporal Planner</span></div><h1 className="mt-4 text-3xl font-semibold tracking-tight">Calendar and focus blocks</h1><p className="mt-2 text-sm leading-6 text-white/55">Schedule meaningful work and keep conflicts visible before they become friction.</p></div>
          <Link href="/workspace/hub" className="text-sm text-white/55 hover:text-white">Back to hub</Link>
        </header>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-3">{events.length === 0 ? <GlassCard hover={false} className="p-8 text-center text-sm text-white/45">No upcoming events yet.</GlassCard> : events.map(item => <GlassCard key={item.id} hover={false} className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-[#e6b24a]">{new Date(item.startAt).toLocaleString()} to {new Date(item.endAt).toLocaleTimeString()}</p><h2 className="mt-2 text-lg font-semibold">{item.title}</h2>{item.description && <p className="mt-2 text-sm leading-6 text-white/55">{item.description}</p>}</div>{item.isFocusBlock && <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300"><Check size={12} />Focus</span>}</div></GlassCard>)}</section>
          <GlassCard hover={false} variant="elevated" className="h-fit p-6"><div className="flex items-center gap-2"><Plus size={18} className="text-[#e6b24a]" /><h2 className="text-lg font-semibold">Schedule event</h2></div><form onSubmit={submit} className="mt-5 space-y-4">{error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</p>}<input required value={title} onChange={event => setTitle(event.target.value)} placeholder="Event title" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 text-sm outline-none focus:border-[#e6b24a]/50" /><textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="Description" rows={3} className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.045] px-3 py-3 text-sm outline-none focus:border-[#e6b24a]/50" /><label className="block text-xs uppercase tracking-[0.15em] text-white/45">Starts<input required type="datetime-local" value={startAt} onChange={event => setStartAt(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0b2030] px-3 text-sm text-white outline-none" /></label><label className="block text-xs uppercase tracking-[0.15em] text-white/45">Ends<input required type="datetime-local" value={endAt} onChange={event => setEndAt(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0b2030] px-3 text-sm text-white outline-none" /></label><label className="flex items-center gap-3 text-sm text-white/65"><input type="checkbox" checked={focusBlock} onChange={event => setFocusBlock(event.target.checked)} className="h-4 w-4 accent-[#e6b24a]" />Protect as focus block</label><button disabled={busy} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] text-sm font-semibold text-[#06131f] disabled:opacity-60">{busy && <Loader2 size={16} className="animate-spin" />}Schedule event</button></form></GlassCard>
        </div>
      </div>
    </main>
  );
}
