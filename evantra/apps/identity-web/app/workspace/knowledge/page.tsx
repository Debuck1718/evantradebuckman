"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2, Plus, Search, Tag } from "lucide-react";

import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { GlassCard } from "../../../components/ui/GlassCard";

interface KnowledgeItem {
  id: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

const types = ["note", "idea", "research", "bookmark", "reflection", "document"];

export default function KnowledgePage() {
  const { session, loading } = useIdentitySession();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("note");
  const [tags, setTags] = useState("");
  const [relatedId, setRelatedId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadItems(search = query): Promise<void> {
    if (!session) return;

    const response = await fetch(`/api/workspace/knowledge?q=${encodeURIComponent(search)}`, {
      cache: "no-store",
      headers: {},
    });

    if (!response.ok) throw new Error("Unable to load knowledge.");
    const payload = (await response.json()) as { items: KnowledgeItem[] };
    setItems(payload.items);
  }

  useEffect(() => {
    if (session) void loadItems("").catch(() => setError("Unable to load knowledge."));
  }, [session]);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!session) return;

    try {
      setBusy(true);
      setError("");
      const response = await fetch("/api/workspace/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          type,
          tags: tags.split(","),
          relatedId: relatedId || undefined,
        }),
      });

      const payload = (await response.json()) as { item?: KnowledgeItem; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to save knowledge.");

      setItems(current => [payload.item!, ...current]);
      setTitle("");
      setContent("");
      setTags("");
      setRelatedId("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save knowledge.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#06131f] text-white"><Loader2 className="animate-spin text-[#e6b24a]" /></main>;
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#06131f] px-6 text-white">
        <GlassCard variant="elevated" className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-semibold">Sign in required</h1>
          <p className="mt-3 text-sm text-white/55">Sign in to build your knowledge workspace.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f]">Sign in</Link>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06131f] px-6 py-10 text-white md:px-8 md:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3 text-[#e6b24a]"><BookOpen size={22} /><span className="text-xs font-semibold uppercase tracking-[0.24em]">Neural Knowledge</span></div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Your connected thinking space</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">Capture decisions, research, ideas, and reflections in one searchable workspace.</p>
          </div>
          <Link href="/workspace/hub" className="text-sm text-white/55 hover:text-white">Back to hub</Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <div className="relative mb-5">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
              <input value={query} onChange={event => { setQuery(event.target.value); void loadItems(event.target.value).catch(() => setError("Unable to search knowledge.")); }} placeholder="Search your knowledge" className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.045] pl-11 pr-4 text-sm text-white outline-none focus:border-[#e6b24a]/50" />
            </div>

            <div className="space-y-3">
              {items.length === 0 ? <GlassCard hover={false} className="p-8 text-center text-sm text-white/45">No knowledge items match this search.</GlassCard> : items.map(item => (
                <GlassCard key={item.id} hover={false} className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#e6b24a]"><span>{item.type}</span><span className="text-white/20">/</span><time>{new Date(item.createdAt).toLocaleDateString()}</time></div>
                  <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/60">{item.content}</p>
                  {item.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{item.tags.map(tag => <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/50"><Tag size={12} />{tag}</span>)}</div>}
                </GlassCard>
              ))}
            </div>
          </section>

          <GlassCard hover={false} variant="elevated" className="h-fit p-6">
            <div className="flex items-center gap-2"><Plus size={18} className="text-[#e6b24a]" /><h2 className="text-lg font-semibold">Capture knowledge</h2></div>
            <form onSubmit={submit} className="mt-5 space-y-4">
              {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</p>}
              <input required value={title} onChange={event => setTitle(event.target.value)} placeholder="Title" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 text-sm outline-none focus:border-[#e6b24a]/50" />
              <select value={type} onChange={event => setType(event.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-[#0b2030] px-3 text-sm outline-none focus:border-[#e6b24a]/50">{types.map(option => <option key={option} value={option}>{option}</option>)}</select>
              <textarea required value={content} onChange={event => setContent(event.target.value)} placeholder="What should you remember?" rows={8} className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.045] px-3 py-3 text-sm leading-6 outline-none focus:border-[#e6b24a]/50" />
              <input value={tags} onChange={event => setTags(event.target.value)} placeholder="Tags, separated by commas" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 text-sm outline-none focus:border-[#e6b24a]/50" />
              <select value={relatedId} onChange={event => setRelatedId(event.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-[#0b2030] px-3 text-sm outline-none focus:border-[#e6b24a]/50"><option value="">No related item</option>{items.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select>
              <button disabled={busy} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] text-sm font-semibold text-[#06131f] disabled:opacity-60">{busy && <Loader2 size={16} className="animate-spin" />}Save to workspace</button>
            </form>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
