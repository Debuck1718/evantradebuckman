"use client";

import Link from "next/link";
import {
  Code2,
  KeyRound,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "../../../components/ui/GlassCard";

/*
 * This page previously rendered two hardcoded
 * applications ("StoreForge", "Evantra Headquarters")
 * under the heading "Registered OAuth Clients" with a
 * "2 Active" counter.
 *
 * They were not real. The identity service exposes no
 * list-clients endpoint, so the page could not show the
 * signed-in developer's own clients, and a developer who
 * had just registered one saw somebody else's sample
 * data instead of their own application. That reads as
 * data loss and destroys confidence in the product.
 *
 * Until a list endpoint exists, the honest thing is to
 * say what is actually true: registration is open, and
 * a new client waits for admin approval before it can
 * complete an OAuth flow.
 */

export default function ApplicationsPage() {
  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#fae59a]">
                <KeyRound size={12} className="text-[#e6b24a]" />
                OAuth 2.0 &amp; OIDC Portal
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Developer Applications
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              Manage client applications that use Evantra Identity to authenticate users,
              issue cryptographic tokens, and access approved workspace scopes.
            </p>
          </div>

          <Link
            href="/workspace/applications/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] shadow-lg shadow-[#e6b24a]/10 transition hover:bg-[#f0c261] hover:-translate-y-0.5"
          >
            <Plus size={17} />
            Register Application
          </Link>
        </div>

        {/* Registered clients */}
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
            <ShieldCheck size={16} className="text-[#e6b24a]" />
            Registered OAuth Clients
          </div>

          <GlassCard variant="default" className="p-7 sm:p-9">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl space-y-3">
                <h2 className="text-lg font-semibold text-white">
                  Client listing is not available in this view yet
                </h2>

                <p className="text-sm leading-relaxed text-white/60">
                  Applications you register are recorded against your account and
                  are awaiting approval. This page cannot display them yet because
                  the identity service does not expose a list-clients endpoint, so
                  we show nothing rather than a placeholder that might be mistaken
                  for your own data.
                </p>

                <p className="text-sm leading-relaxed text-white/60">
                  Keep the <span className="font-mono text-[#fae59a]">client_id</span>{" "}
                  and <span className="font-mono text-[#fae59a]">client_secret</span>{" "}
                  you received at registration. The secret is shown only once.
                </p>

                <div className="flex items-start gap-3 rounded-2xl border border-[#e6b24a]/25 bg-[#e6b24a]/10 p-4">
                  <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#fae59a]" />
                  <p className="text-xs leading-relaxed text-white/70">
                    A newly registered client starts in{" "}
                    <span className="font-semibold text-[#fae59a]">PENDING_APPROVAL</span>{" "}
                    and cannot complete an OAuth flow until an Evantra administrator
                    approves it. Registering the same application again does not
                    speed this up.
                  </p>
                </div>
              </div>

              <Link
                href="/workspace/applications/new"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
              >
                <Plus size={16} />
                Register Application
              </Link>
            </div>
          </GlassCard>
        </section>

        {/* Developer Integration Quickstart */}
        <section className="mt-12">
          <GlassCard variant="gold" className="p-7 sm:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Code2 size={20} className="text-[#e6b24a]" />
                  <h3 className="text-lg font-semibold text-white">
                    Integrate into your React or Next.js App
                  </h3>
                </div>

                <p className="max-w-2xl text-xs leading-relaxed text-white/65 sm:text-sm">
                  Add unified Evantra authentication to your application in minutes with our official
                  <code className="mx-1.5 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[#fae59a]">@evantra-identity/react</code>
                  SDK.
                </p>

                <div className="rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-white/80 overflow-x-auto">
                  <span className="text-purple-400">import</span> &#123; EvantraSignInButton &#125;{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-emerald-300">&quot;@evantra-identity/react&quot;</span>;
                  <br />
                  <br />
                  <span className="text-blue-400">&lt;EvantraSignInButton</span>{" "}
                  <span className="text-amber-300">clientId</span>=
                  <span className="text-emerald-300">&quot;your_client_id&quot;</span>{" "}
                  <span className="text-blue-400">/&gt;</span>
                </div>
              </div>

              <div className="shrink-0">
                <Link
                  href="/workspace/applications/new"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
                >
                  <Plus size={16} />
                  New Client
                </Link>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>
    </main>
  );
}