"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  CheckCircle2,
  Inbox,
  Loader2,
  MailQuestion,
} from "lucide-react";

interface SupportRequest {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  adminReply: string | null;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  OPEN: "border-[#e6b24a]/30 bg-[#e6b24a]/10 text-[#e6b24a]",
  IN_REVIEW: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  RESOLVED: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  DISMISSED: "border-white/20 bg-white/5 text-white/50",
};

export default function SupportPage() {
  const [category, setCategory] = useState("bug");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      const response = await fetch("/api/workspace/support", { cache: "no-store" });
      if (response.ok) {
        const payload = await response.json();
        setRequests(payload.requests ?? []);
      }
    } finally {
      setLoadingRequests(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/workspace/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, message, contactEmail }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to submit the request.");
      }

      setSuccess(true);
      setSubject("");
      setMessage("");
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit the request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
      <header className="mb-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#e6b24a]/20 bg-[#e6b24a]/10">
          <MailQuestion size={22} className="text-[#e6b24a]" />
        </div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
          Evantra Support
        </p>
        <h1 className="text-3xl font-semibold">Contact support</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
          Facing an issue with your account, workspace, or any Evantra tool?
          Send a request to the Evantra Team and track the response here.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* New request form */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-lg font-semibold">New support request</h2>

          {success && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
              <CheckCircle2 size={18} />
              Request sent — the Evantra Team will respond here.
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-white/80">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#e6b24a]/50"
              >
                <option value="bug">Bug report</option>
                <option value="account">Account issue</option>
                <option value="billing">Billing</option>
                <option value="feature">Feature request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contactEmail" className="mb-2 block text-sm font-medium text-white/80">
                Contact email
              </label>
              <input
                id="contactEmail"
                type="email"
                required
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#e6b24a]/50"
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white/80">
                Subject
              </label>
              <input
                id="subject"
                required
                minLength={3}
                maxLength={255}
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Short summary of the issue"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#e6b24a]/50"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/80">
                Details
              </label>
              <textarea
                id="message"
                required
                minLength={10}
                maxLength={20000}
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Describe what happened and what you expected..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#e6b24a]/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send request"
              )}
            </button>
          </form>
        </section>

        {/* My requests */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-lg font-semibold">My requests</h2>

          {loadingRequests ? (
            <p className="mt-6 text-sm text-white/40">Loading...</p>
          ) : requests.length === 0 ? (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
              <Inbox size={28} className="mx-auto text-white/25" />
              <p className="mt-3 text-sm text-white/40">No requests yet.</p>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {requests.map((request) => (
                <li
                  key={request.id}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{request.subject}</p>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[request.status] ?? STATUS_STYLES.OPEN}`}
                    >
                      {request.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">
                    {request.message}
                  </p>
                  {request.adminReply && (
                    <p className="mt-3 rounded-lg border border-[#e6b24a]/20 bg-[#e6b24a]/5 px-3 py-2 text-sm leading-6 text-[#e6b24a]">
                      Evantra Team: {request.adminReply}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-white/30">
                    {request.category} · {new Date(request.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
