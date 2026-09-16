"use client";

import { useEffect, useState } from "react";

import { Mail, MailOpen, Loader2 } from "lucide-react";

interface InboundEmail {
  id: string;
  messageId: string | null;
  fromEmail: string;
  fromName: string | null;
  toEmail: string;
  subject: string | null;
  bodyText: string | null;
  receivedAt: string;
  readAt: string | null;
}

export default function AdminInboundPage() {
  const [emails, setEmails] = useState<InboundEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    try {
      const response = await fetch("/api/admin/inbound", { cache: "no-store" });
      if (response.status === 403) {
        setForbidden(true);
        return;
      }
      if (response.ok) {
        const payload = await response.json();
        setEmails(payload.emails ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    setBusyId(id);
    try {
      await fetch("/api/admin/inbound", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setEmails((current) =>
        current.map((email) =>
          email.id === id
            ? { ...email, readAt: email.readAt ?? new Date().toISOString() }
            : email,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to mark as read.");
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
          The inbound inbox is only available to members of the Evantra Team
          organization.
        </p>
      </main>
    );
  }

  const unread = emails.filter((email) => !email.readAt).length;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
      <header className="mb-10">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
          Evantra Team
        </p>
        <h1 className="text-3xl font-semibold">Inbound inbox</h1>
        <p className="mt-3 text-sm text-white/50">
          Emails received at your headquarters contact address via Resend.
          {unread > 0 && (
            <span className="ml-2 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#e6b24a]">
              {unread} unread
            </span>
          )}
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {emails.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <Mail size={32} className="mx-auto text-white/25" />
          <p className="mt-4 text-sm text-white/40">No inbound emails yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {emails.map((email) => {
            const isOpen = openId === email.id;

            return (
              <li
                key={email.id}
                className={`rounded-2xl border p-6 transition ${
                  email.readAt
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-[#e6b24a]/30 bg-[#e6b24a]/[0.06]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(isOpen ? null : email.id);
                    if (!email.readAt) {
                      void markRead(email.id);
                    }
                  }}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-white">
                      {email.subject ?? "(no subject)"}
                    </p>
                    <p className="mt-1 truncate text-sm text-white/50">
                      {email.fromName ? `${email.fromName} · ` : ""}
                      {email.fromEmail} → {email.toEmail}
                    </p>
                    <p className="mt-1 text-xs text-white/30">
                      {new Date(email.receivedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="mt-1 shrink-0 text-white/40">
                    {email.readAt ? (
                      <MailOpen size={18} />
                    ) : busyId === email.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Mail size={18} className="text-[#e6b24a]" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-4 whitespace-pre-wrap border-t border-white/10 pt-4 text-sm leading-6 text-white/70">
                    {email.bodyText ?? "(no plain text body)"}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
