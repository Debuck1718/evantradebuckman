"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, Send } from "lucide-react";
import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { GlassCard } from "../../../components/ui/GlassCard";

type Intent = "weekly-priorities" | "project-status" | "goal-risk" | "context-collection" | "deadline-focus";
interface Result { threadId: string; provider: "ai" | "fallback"; insight: { summary: string; actionItems: string[]; evidence: { source: string; reference: string }[] } }

const options: { value: Intent; label: string }[] = [
  { value: "weekly-priorities", label: "Weekly priorities" },
  { value: "project-status", label: "Project status" },
  { value: "goal-risk", label: "Goal risks" },
  { value: "context-collection", label: "Find related context" },
  { value: "deadline-focus", label: "Deadline focus" },
];

export default function AssistantPage() {
  const { session, loading } = useIdentitySession();
  const [intent, setIntent] = useState<Intent>("weekly-priorities");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !question.trim()) return;
    try {
      setBusy(true); setError("");
      const response = await fetch("/api/workspace/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, question }),
      });
      const payload = await response.json() as Result & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to query assistant.");
      setResult(payload); setQuestion("");
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Unable to query assistant."); } finally { setBusy(false); }
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#06131f] text-white"><Loader2 className="animate-spin text-[#e6b24a]" /></main>;
  if (!session) return <main className="flex min-h-screen items-center justify-center bg-[#06131f] px-6 text-white"><GlassCard variant="elevated" className="w-full max-w-md p-8 text-center"><h1 className="text-2xl font-semibold">Sign in required</h1><Link href="/login" className="mt-6 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f]">Sign in</Link></GlassCard></main>;

  return <main className="min-h-screen bg-[#06131f] px-6 py-10 text-white md:px-8 md:py-14"><div className="mx-auto max-w-5xl"><header className="mb-8 flex items-end justify-between border-b border-white/10 pb-7"><div><div className="flex items-center gap-3 text-[#e6b24a]"><Bot size={22} /><span className="text-xs font-semibold uppercase tracking-[0.24em]">Workspace Assistant</span></div><h1 className="mt-4 text-3xl font-semibold tracking-tight">Turn context into your next move</h1><p className="mt-2 text-sm leading-6 text-white/55">Ask for a grounded briefing from the workspace signals you have authorized.</p></div><Link href="/workspace/hub" className="text-sm text-white/55 hover:text-white">Back to hub</Link></header><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">{result ? <section className="space-y-5"><GlassCard hover={false} variant="gold" className="p-7"><p className="text-xs uppercase tracking-[0.2em] text-[#e6b24a]">Briefing</p><h2 className="mt-4 text-xl font-semibold leading-8">{result.insight.summary}</h2></GlassCard><GlassCard hover={false} className="p-7"><h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Suggested actions</h2><div className="mt-5 space-y-3">{result.insight.actionItems.length ? result.insight.actionItems.map(item => <p key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75">{item}</p>) : <p className="text-sm text-white/45">No immediate actions were surfaced.</p>}</div></GlassCard>{result.insight.evidence.length > 0 && <GlassCard hover={false} className="p-7"><h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">Evidence</h2><div className="mt-5 space-y-2">{result.insight.evidence.map((item, index) => <p key={`${item.source}-${index}`} className="text-sm text-white/60"><span className="mr-2 text-[#e6b24a]">{item.source}</span>{item.reference}</p>)}</div></GlassCard>}</section> : <GlassCard hover={false} className="flex min-h-[360px] items-center justify-center p-8 text-center"><div><Bot size={34} className="mx-auto text-[#e6b24a]" /><p className="mt-5 text-sm text-white/45">Your next briefing will appear here.</p></div></GlassCard>}<GlassCard hover={false} variant="elevated" className="h-fit p-6"><h2 className="text-lg font-semibold">Ask the workspace</h2><form onSubmit={submit} className="mt-5 space-y-4">{error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</p>}<select value={intent} onChange={event => setIntent(event.target.value as Intent)} className="h-11 w-full rounded-xl border border-white/10 bg-[#0b2030] px-3 text-sm outline-none">{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><textarea required value={question} onChange={event => setQuestion(event.target.value)} rows={7} placeholder="What should I focus on this week?" className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.045] px-3 py-3 text-sm leading-6 outline-none focus:border-[#e6b24a]/50" /><button disabled={busy} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] text-sm font-semibold text-[#06131f] disabled:opacity-60">{busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}Ask assistant</button></form></GlassCard></div></div></main>;
}
