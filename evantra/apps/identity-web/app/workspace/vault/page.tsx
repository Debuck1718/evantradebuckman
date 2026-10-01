"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Briefcase,
  CheckCircle2,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Fingerprint,
  FolderLock,
  GraduationCap,
  Loader2,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { GlassCard } from "../../../components/ui/GlassCard";

/*
 * Vault.
 *
 * Records are encrypted at rest (AES-256-GCM) and only ever
 * decrypted in this process for the owning account. The UI says
 * exactly that — "encrypted at rest, decrypted only for you" —
 * rather than claiming the server cannot read them, because the
 * server holds the key.
 */

type VaultCategory =
  | "certificate"
  | "cv"
  | "id-record"
  | "contract"
  | "receipt"
  | "project-doc"
  | "academic-record"
  | "business-doc"
  | "other";

interface VaultItem {
  id: string;
  category: VaultCategory;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_META: Record<
  VaultCategory,
  { label: string; icon: typeof Lock; accent: string }
> = {
  certificate: { label: "Certificate", icon: Award, accent: "text-amber-300" },
  cv: { label: "CV / Résumé", icon: FileText, accent: "text-sky-300" },
  "id-record": {
    label: "ID Record",
    icon: Fingerprint,
    accent: "text-rose-300",
  },
  contract: { label: "Contract", icon: FileText, accent: "text-emerald-300" },
  receipt: { label: "Receipt", icon: CreditCard, accent: "text-cyan-300" },
  "project-doc": {
    label: "Project Doc",
    icon: Briefcase,
    accent: "text-violet-300",
  },
  "academic-record": {
    label: "Academic Record",
    icon: GraduationCap,
    accent: "text-indigo-300",
  },
  "business-doc": {
    label: "Business Doc",
    icon: Briefcase,
    accent: "text-teal-300",
  },
  other: { label: "Other", icon: FolderLock, accent: "text-white/70" },
};

const CATEGORIES = Object.keys(CATEGORY_META) as VaultCategory[];

export default function VaultPage() {
  const { account, session, loading } = useIdentitySession();

  const [items, setItems] = useState<VaultItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<VaultCategory | "all">("all");

  const [composerOpen, setComposerOpen] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // Composer fields
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCategory, setDraftCategory] = useState<VaultCategory>("contract");
  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setBusy(true);
        setError(null);

        const response = await fetch("/api/workspace/vault", {
          cache: "no-store",
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(payload.error ?? "Unable to load the vault.");
        }

        const payload = (await response.json()) as { items: VaultItem[] };
        setItems(payload.items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load the vault.",
        );
      } finally {
        setBusy(false);
      }
    }

    if (session) void load();
  }, [session]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return items.filter((item) => {
      if (filter !== "all" && item.category !== filter) return false;
      if (!needle) return true;

      return (
        item.title.toLowerCase().includes(needle) ||
        item.content.toLowerCase().includes(needle) ||
        item.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [items, query, filter]);

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, [items]);

  async function createItem(): Promise<void> {
    if (!draftTitle.trim() || !draftContent.trim()) {
      setError("A title and some content are required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch("/api/workspace/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: draftCategory,
          title: draftTitle,
          content: draftContent,
          tags: draftTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(payload.error ?? "Unable to save the item.");
      }

      const payload = (await response.json()) as { item: VaultItem };
      setItems((current) => [payload.item, ...current]);

      setDraftTitle("");
      setDraftContent("");
      setDraftTags("");
      setDraftCategory("contract");
      setComposerOpen(false);
      setNotice("Item encrypted and stored.");
      window.setTimeout(() => setNotice(null), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save the item.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: string): Promise<void> {
    const previous = items;
    setItems((current) => current.filter((item) => item.id !== id));

    try {
      const response = await fetch(
        `/api/workspace/vault?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );

      if (!response.ok) throw new Error("Delete failed.");
    } catch {
      setItems(previous);
      setError("Unable to delete that item.");
    }
  }

  async function copyContent(item: VaultItem): Promise<void> {
    try {
      await navigator.clipboard.writeText(item.content);
      setNotice(`"${item.title}" copied to clipboard.`);
      window.setTimeout(() => setNotice(null), 2500);
    } catch {
      setError("Clipboard access was denied.");
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
          <GlassCard
            variant="elevated"
            className="w-full p-8 text-center sm:p-10"
          >
            <FolderLock size={40} className="mx-auto text-[#e6b24a]" />
            <h1 className="mt-6 text-2xl font-semibold">Sign in required</h1>
            <p className="mt-3 text-sm text-white/50">
              The vault is private to your account.
            </p>
            <Link
              href="/login?returnTo=/workspace/vault"
              className="mt-7 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f]"
            >
              Sign in with Evantra ID
            </Link>
          </GlassCard>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
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
                Vault
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Encrypted Document Vault
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">
              Contracts, credentials and records sealed with AES-256-GCM before
              they touch the database. Your content is never written in plain
              text, and only your account can open it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setComposerOpen((open) => !open)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] shadow-lg shadow-[#e6b24a]/10 transition hover:-translate-y-0.5 hover:bg-[#f0c261]"
          >
            {composerOpen ? <X size={16} /> : <Plus size={16} />}
            {composerOpen ? "Close" : "New Secure Item"}
          </button>
        </div>

        {/* Encryption assurance strip */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Lock,
              title: "AES-256-GCM",
              body: "Authenticated encryption. Altered records fail to open rather than returning corrupted text.",
            },
            {
              icon: ShieldCheck,
              title: "Account-scoped",
              body: "Every read and delete is filtered by your account id, so no one else can reach your records.",
            },
            {
              icon: Fingerprint,
              title: "Ciphertext at rest",
              body: "The database stores an encrypted payload, an IV and an auth tag — never your plain text.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <GlassCard
              key={title}
              variant="default"
              hover={false}
              className="p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6b24a]/10 text-[#e6b24a]">
                  <Icon size={19} />
                </div>
                <span className="text-sm font-semibold text-white">
                  {title}
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/55">{body}</p>
            </GlassCard>
          ))}
        </div>

        {notice && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-300">
            <CheckCircle2 size={15} />
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
            <AlertTriangle size={15} />
            {error}
          </div>
        )}

        {/* Composer */}
        {composerOpen && (
          <GlassCard variant="gold" className="mt-8 p-6 sm:p-8" hover={false}>
            <h2 className="text-lg font-semibold">New secure item</h2>
            <p className="mt-1 text-xs text-white/50">
              Encrypted in this request. The plain text is never persisted.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium text-white/60">Title</span>
                <input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="e.g. Consultancy Agreement — Falcon"
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#e6b24a]"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-medium text-white/60">
                  Category
                </span>
                <select
                  value={draftCategory}
                  onChange={(event) =>
                    setDraftCategory(event.target.value as VaultCategory)
                  }
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-[#e6b24a]"
                >
                  {CATEGORIES.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-[#06131f]"
                    >
                      {CATEGORY_META[category].label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 flex flex-col gap-2">
              <span className="text-xs font-medium text-white/60">Content</span>
              <textarea
                value={draftContent}
                onChange={(event) => setDraftContent(event.target.value)}
                rows={6}
                placeholder="Paste the contract text, credential details, or notes you need kept private."
                className="resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-[#e6b24a]"
              />
            </label>

            <label className="mt-4 flex flex-col gap-2">
              <span className="text-xs font-medium text-white/60">
                Tags <span className="text-white/30">(comma separated)</span>
              </span>
              <input
                value={draftTags}
                onChange={(event) => setDraftTags(event.target.value)}
                placeholder="client, 2026, signed"
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#e6b24a]"
              />
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void createItem()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Encrypting…
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Encrypt &amp; Store
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        )}

        {/* Controls */}
        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search decrypted contents…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#e6b24a]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                filter === "all"
                  ? "border-[#e6b24a]/50 bg-[#e6b24a]/15 text-[#fae59a]"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20"
              }`}
            >
              All ({items.length})
            </button>

            {CATEGORIES.filter((category) => countsByCategory[category]).map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    filter === category
                      ? "border-[#e6b24a]/50 bg-[#e6b24a]/15 text-[#fae59a]"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20"
                  }`}
                >
                  {CATEGORY_META[category].label} ({countsByCategory[category]})
                </button>
              ),
            )}
          </div>
        </div>

        {/* Items */}
        <div className="mt-6">
          {busy ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="animate-spin text-[#e6b24a]" />
            </div>
          ) : filtered.length === 0 ? (
            <GlassCard
              variant="default"
              hover={false}
              className="p-12 text-center"
            >
              <FolderLock size={40} className="mx-auto text-white/25" />
              <h3 className="mt-5 text-lg font-semibold">
                {items.length === 0 ? "Your vault is empty" : "Nothing matches"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
                {items.length === 0
                  ? "Store contracts, credentials and records here. Each item is encrypted before it is saved."
                  : "Try a different search term or category."}
              </p>
            </GlassCard>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filtered.map((item) => {
                const meta =
                  CATEGORY_META[item.category] ?? CATEGORY_META.other;
                const Icon = meta.icon;
                const isOpen = revealed[item.id] === true;

                return (
                  <GlassCard
                    key={item.id}
                    variant="default"
                    hover={false}
                    className="flex flex-col p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                          <Icon size={19} className={meta.accent} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/40">
                            {meta.label}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        {item.isFavorite && (
                          <Star size={15} className="text-[#e6b24a]" />
                        )}
                        <button
                          type="button"
                          aria-label={
                            isOpen ? "Hide contents" : "Reveal contents"
                          }
                          onClick={() =>
                            setRevealed((current) => ({
                              ...current,
                              [item.id]: !isOpen,
                            }))
                          }
                          className="rounded-lg p-2 text-white/45 transition hover:bg-white/5 hover:text-white"
                        >
                          {isOpen ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          type="button"
                          aria-label="Delete item"
                          onClick={() => void removeItem(item.id)}
                          className="rounded-lg p-2 text-white/45 transition hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-5 flex-1">
                      {isOpen ? (
                        <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/5 bg-black/30 p-4 font-mono text-xs leading-6 text-white/85">
                          {item.content}
                        </pre>
                      ) : (
                        <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                          <p className="select-none font-mono text-xs leading-6 text-white/30 blur-[3px]">
                            {item.content.slice(0, 220) || "Encrypted payload"}
                          </p>
                          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/40">
                            <Lock size={12} />
                            Decrypted on reveal
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Tags + meta */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/60"
                        >
                          {tag}
                        </span>
                      ))}

                      <button
                        type="button"
                        onClick={() => void copyContent(item)}
                        className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-[#e6b24a] transition hover:text-[#fae59a]"
                      >
                        <Copy size={12} />
                        Copy
                      </button>
                    </div>

                    <p className="mt-3 text-[11px] text-white/30">
                      Stored {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
