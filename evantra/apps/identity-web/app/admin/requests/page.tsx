"use client";

import { useEffect, useState } from "react";

import { Inbox, Loader2, Send } from "lucide-react";

interface AdminSupportRequest {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  adminReply: string | null;
  createdAt: string;
  accountId: string;
  contactEmail: string;
}

const STATUS_STYLES: Record<string, string> = {
  OPEN: "border-[#e6b24a]/30 bg-[#e6b24a]/10 text-[#e6b24a]",
  IN_REVIEW: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  RESOLVED: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  DISMISSED: "border-white/20 bg-white/5 text-white/50",
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminSupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  async function load() {
    try {
      const response = await fetch("/api/admin/support", { cache: "no-store" });
      if (response.status === 403) {
        setForbidden(true);
        return;
      }
      if (response.ok) {
        const payload = await response.json();
        setRequests(payload.requests ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateRequest(id: string, status: string) {
    setError("");
    setBusyId(id);

    try {
      const response = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          adminReply: replyDrafts[id]?.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to update the request.");
      }

      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update the request.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-10 text-sm text-white/40">
        Loading...
      </main>
    );
  }

  if (forbidden) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
          Restricted
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-white">
          Evantra Team membership required
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/50">
          This console is only available to members of the Evantra Team
          organization. If you should have access, ask a platform operator
          to invite your Evantra ID.
        </p>
      </main>
    );
  }

  const open = requests.filter((request) => request.status === "OPEN");
  const rest = requests.filter((request) => request.status !== "OPEN");

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
      <header className="mb-10">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
          Evantra Team
        </p>
        <h1 className="text-3xl font-semibold">Support requests</h1>
        <p className="mt-3 text-sm text-white/50">
          Review and respond to issues submitted by users across the platform.
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="rounded-2xl border-white/10 bg-white/[0.03] p-10 text-center">
          <Inbox size={32} className="mx-auto text-white/25" />
          <p className="mt-4 text-sm text-white/40">No support requests yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {[
            { label: "Open requests", items: open },
            { label: "Handled", items: rest },
          ].map((group) =>
            group.items.length > 0 ? (
              <section key={group.label}>
                <h2 className="mb-4 text-lg font-semibold text-white/80">
                  {group.label}
                  <span className="ml-2 text-sm font-normal text-white/30">
                    ({group.items.length})
                  </span>
                </h2>
                <ul className="space-y-4">
                  {group.items.map((request) => (
                    <li
                      key={request.id}
                      className="rounded-2xl border-white/10 bg-white/[0.03] p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-base font-semibold text-white">
                          {request.subject}
                        </p>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[request.status]}`}
                        >
                          {request.status.replace("_", " ")}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {request.message}
                      </p>

                      <p className="mt-3 text-xs text-white/30">
                        {request.category} · {request.contactEmail} ·{" "}
                        {new Date(request.createdAt).toLocaleString()}
                      </p>

                      {request.adminReply && (
                        <p className="mt-3 rounded-lg border-[#e6b24a]/20 bg-[#e6b24a]/5 px-3 py-2 text-sm leading-6 text-[#e6b24a]">
                          Your reply: {request.adminReply}
                        </p>
                      )}

                      {request.status !== "RESOLVED" && request.status !== "DISMISSED" && (
                        <div className="mt-4 space-y-3">
                          <textarea
                            rows={2}
                            value={replyDrafts[request.id] ?? ""}
                            onChange={(event) =>
                              setReplyDrafts((drafts) => ({
                                ...drafts,
                                [request.id]: event.target.value,
                              }))
                            }
                            placeholder="Reply to the user (optional)..."
                            className="w-full rounded-xl border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#e6b24a]/50"
                          />
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => updateRequest(request.id, "IN_REVIEW")}
                              disabled={busyId === request.id}
                              className="flex items-center gap-1.5 rounded-lg border-sky-400/30 bg-sky-400/10 px-3.5 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-400/20 disabled:opacity-50"
                            >
                              {busyId === request.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Send size={14} />
                              )}
                              Mark in review
                            </button>
                            <button
                              onClick={() => updateRequest(request.id, "RESOLVED")}
                              disabled={busyId === request.id}
                              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/90 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                            >
                              {busyId === request.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Send size={14} />
                              )}
                              Resolve{replyDrafts[request.id]?.trim() ? " & reply" : ""}
                            </button>
                            <button
                              onClick={() => updateRequest(request.id, "DISMISSED")}
                              disabled={busyId === request.id}
                              className="rounded-lg border-white/15 px-3.5 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/5 disabled:opacity-50"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null,
          )}
        </div>
      )}
    </main>
  );
}
