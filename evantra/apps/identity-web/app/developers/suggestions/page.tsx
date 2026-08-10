"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import { IdentityShell } from "../../../components/identity/IdentityShell";

interface Suggestion {
  id: string;
  title: string;
  author: string;
  email: string;
  area: string;
  details: string;
  createdAt: string;
}

const STORAGE_KEY = "evantra_identity_suggestions";

function loadSuggestions(): Suggestion[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Suggestion[]) : [];
  } catch {
    return [];
  }
}

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("developer experience");
  const [details, setDetails] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSuggestions(loadSuggestions());
  }, []);

  function persist(next: Suggestion[]) {
    setSuggestions(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);

    const record: Suggestion = {
      id: crypto.randomUUID(),
      title: title.trim(),
      author: author.trim(),
      email: email.trim(),
      area,
      details: details.trim(),
      createdAt: new Date().toISOString(),
    };

    const next = [record, ...suggestions];
    persist(next);

    setTitle("");
    setAuthor("");
    setEmail("");
    setArea("developer experience");
    setDetails("");
    setSaved(true);
  }

  return (
    <IdentityShell
      title="Suggestions"
      description="Submit ideas for Evantra workers and developers to review and improve the identity platform."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Feedback queue
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Every suggestion helps shape the next release.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Submissions are stored locally in this workspace demo so Evantra developers can review the flow. In production, this should post to a secured review API or internal queue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70">
              <span>Title</span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-white/25"
                placeholder="Improve consent clarity"
              />
            </label>

            <label className="space-y-2 text-sm text-white/70">
              <span>Your name</span>
              <input
                required
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-white/25"
                placeholder="Evantra worker or developer"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70">
              <span>Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-white/25"
                placeholder="you@evantra.com"
              />
            </label>

            <label className="space-y-2 text-sm text-white/70">
              <span>Area</span>
              <select
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
              >
                <option value="developer experience">Developer experience</option>
                <option value="user onboarding">User onboarding</option>
                <option value="admin operations">Admin operations</option>
                <option value="security">Security</option>
                <option value="docs and terms">Docs and terms</option>
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm text-white/70 block">
            <span>Details</span>
            <textarea
              required
              rows={6}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-white/25"
              placeholder="Explain the change, why it matters, and what problem it solves."
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
            >
              Submit suggestion
            </button>
            <Link
              href="/admin/submissions"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              View review board
            </Link>
          </div>

          {saved && (
            <p className="text-sm text-emerald-300/80">
              Submission saved for Evantra review.
            </p>
          )}
        </form>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between gap-4">
            <h4 className="text-lg font-semibold text-white">
              Recent submissions
            </h4>
            <span className="text-xs uppercase tracking-[0.18em] text-white/35">
              Local review queue
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h5 className="font-semibold text-white">
                      {item.title}
                    </h5>
                    <span className="rounded-full border border-[#e6b24a]/20 bg-[#e6b24a]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#f5d48a]">
                      New
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {item.details}
                  </p>
                  <p className="mt-3 text-xs text-white/35">
                    {item.area} • {item.author} • {item.email}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-white/45">
                No suggestions yet. Submit the first improvement idea.
              </p>
            )}
          </div>
        </section>
      </div>
    </IdentityShell>
  );
}
