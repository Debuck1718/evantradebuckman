"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Loader2, Plus, WalletCards } from "lucide-react";

import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { GlassCard } from "../../../components/ui/GlassCard";

interface Entry { id: string; type: "income" | "expense"; amount: number; currency: string; category: string; note?: string; occurredAt: string; }
interface Overview { income: number; expenses: number; balance: number; }

export default function FinancePage() {
  const { session, loading } = useIdentitySession();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [overview, setOverview] = useState<Overview>({ income: 0, expenses: 0, balance: 0 });
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load(): Promise<void> {
    if (!session) return;
    const response = await fetch("/api/workspace/finance", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load finance.");
    const payload = (await response.json()) as { entries: Entry[]; overview: Overview };
    setEntries(payload.entries);
    setOverview(payload.overview);
  }

  useEffect(() => { void load().catch(() => setError("Unable to load finance.")); }, [session]);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!session) return;
    try {
      setBusy(true); setError("");
      const response = await fetch("/api/workspace/finance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, amount: Number(amount), category, note }) });
      const payload = (await response.json()) as { entry?: Entry; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to save finance entry.");
      setEntries(current => [payload.entry!, ...current]);
      setOverview(current => ({ ...current, income: current.income + (type === "income" ? Number(amount) : 0), expenses: current.expenses + (type === "expense" ? Number(amount) : 0), balance: current.balance + (type === "income" ? Number(amount) : -Number(amount)) }));
      setAmount(""); setCategory(""); setNote("");
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Unable to save finance entry."); } finally { setBusy(false); }
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#06131f] text-white"><Loader2 className="animate-spin text-[#e6b24a]" /></main>;
  if (!session) return <main className="flex min-h-screen items-center justify-center bg-[#06131f] px-6 text-white"><GlassCard variant="elevated" className="w-full max-w-md p-8 text-center"><h1 className="text-2xl font-semibold">Sign in required</h1><Link href="/login" className="mt-6 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f]">Sign in</Link></GlassCard></main>;

  return <main className="min-h-screen bg-[#06131f] px-6 py-10 text-white md:px-8 md:py-14"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-3 text-[#e6b24a]"><WalletCards size={22} /><span className="text-xs font-semibold uppercase tracking-[0.24em]">Finance</span></div><h1 className="mt-4 text-3xl font-semibold tracking-tight">Your workspace ledger</h1><p className="mt-2 text-sm leading-6 text-white/55">Keep the financial signals behind your decisions visible and organized.</p></div><Link href="/workspace/hub" className="text-sm text-white/55 hover:text-white">Back to hub</Link></header><div className="grid gap-4 sm:grid-cols-3"><GlassCard hover={false} className="p-5"><p className="text-xs uppercase tracking-[0.16em] text-white/45">Income</p><p className="mt-3 text-2xl font-semibold text-emerald-300">${overview.income.toFixed(2)}</p></GlassCard><GlassCard hover={false} className="p-5"><p className="text-xs uppercase tracking-[0.16em] text-white/45">Expenses</p><p className="mt-3 text-2xl font-semibold text-rose-300">${overview.expenses.toFixed(2)}</p></GlassCard><GlassCard hover={false} variant="gold" className="p-5"><p className="text-xs uppercase tracking-[0.16em] text-white/45">Balance</p><p className="mt-3 text-2xl font-semibold">${overview.balance.toFixed(2)}</p></GlassCard></div><div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><section className="space-y-3">{entries.length === 0 ? <GlassCard hover={false} className="p-8 text-center text-sm text-white/45">No ledger entries yet.</GlassCard> : entries.map(entry => <GlassCard key={entry.id} hover={false} className="p-5"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3">{entry.type === "income" ? <ArrowDownLeft className="text-emerald-300" size={18} /> : <ArrowUpRight className="text-rose-300" size={18} />}<div><h2 className="font-semibold">{entry.category}</h2><p className="text-xs text-white/40">{entry.note || "No note"} · {new Date(entry.occurredAt).toLocaleDateString()}</p></div></div><span className={entry.type === "income" ? "text-emerald-300" : "text-rose-300"}>{entry.type === "income" ? "+" : "-"}${entry.amount.toFixed(2)}</span></div></GlassCard>)}</section><GlassCard hover={false} variant="elevated" className="h-fit p-6"><div className="flex items-center gap-2"><Plus size={18} className="text-[#e6b24a]" /><h2 className="text-lg font-semibold">Record entry</h2></div><form onSubmit={submit} className="mt-5 space-y-4">{error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</p>}<div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setType("expense")} className={`h-10 rounded-lg text-sm ${type === "expense" ? "bg-rose-400/20 text-rose-200" : "bg-white/5 text-white/45"}`}>Expense</button><button type="button" onClick={() => setType("income")} className={`h-10 rounded-lg text-sm ${type === "income" ? "bg-emerald-400/20 text-emerald-200" : "bg-white/5 text-white/45"}`}>Income</button></div><input required type="number" min="0.01" step="0.01" value={amount} onChange={event => setAmount(event.target.value)} placeholder="Amount" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 text-sm outline-none focus:border-[#e6b24a]/50" /><input required value={category} onChange={event => setCategory(event.target.value)} placeholder="Category" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 text-sm outline-none focus:border-[#e6b24a]/50" /><input value={note} onChange={event => setNote(event.target.value)} placeholder="Note (optional)" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 text-sm outline-none focus:border-[#e6b24a]/50" /><button disabled={busy} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] text-sm font-semibold text-[#06131f] disabled:opacity-60">{busy && <Loader2 size={16} className="animate-spin" />}Save entry</button></form></GlassCard></div></div></main>;
}
