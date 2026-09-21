"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Bell, CheckCheck } from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const response = await fetch("/api/workspace/notifications", { cache: "no-store" });
      if (response.ok) {
        const payload = await response.json();
        setNotifications(payload.notifications ?? []);
        setUnread(payload.unread ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markAllRead() {
    await fetch("/api/workspace/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    await load();
  }

  async function markRead(id: string) {
    await fetch("/api/workspace/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    await load();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-8 lg:px-10">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-[#e6b24a]/20 bg-[#e6b24a]/10">
            <Bell size={22} className="text-[#e6b24a]" />
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
            Evantra Workspace
          </p>
          <h1 className="text-3xl font-semibold">Notifications</h1>
          <p className="mt-3 text-sm text-white/50">
            {unread > 0 ? `${unread} unread notification${unread === 1 ? "" : "s"}` : "You're all caught up."}
          </p>
        </div>

        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-xl border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        )}
      </header>

      {loading ? (
        <p className="text-sm text-white/40">Loading...</p>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border-white/10 bg-white/[0.03] p-10 text-center">
          <Bell size={32} className="mx-auto text-white/25" />
          <p className="mt-4 text-sm text-white/40">No notifications yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((item) => {
            const content = (
              <div
                className={`rounded-xl border p-5 transition ${
                  item.readAt
                    ? "border-white/10 bg-white/[0.02]"
                    : "border-[#e6b24a]/25 bg-[#e6b24a]/[0.06]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-sm font-semibold ${item.readAt ? "text-white/70" : "text-white"}`}>
                    {item.title}
                  </p>
                  {!item.readAt && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#e6b24a]" />
                  )}
                </div>
                {item.body && (
                  <p className="mt-2 text-sm leading-6 text-white/50">{item.body}</p>
                )}
                <p className="mt-3 text-xs text-white/30">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            );

            return (
              <li key={item.id}>
                {item.link ? (
                  <Link
                    href={item.link}
                    onClick={() => markRead(item.id)}
                    className="block"
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    onClick={() => !item.readAt && markRead(item.id)}
                    className="block w-full text-left"
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
