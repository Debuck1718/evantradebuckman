"use client";

import Link from "next/link";
import {
  ArrowRight,
  Code2,
  KeyRound,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "../../../components/ui/GlassCard";

const applications = [
  {
    name: "StoreForge",
    slug: "storeforge",
    description: "Evantra commerce and multi-merchant storefront infrastructure.",
    status: "Verified Ecosystem App",
    scopes: ["openid", "profile", "email"],
    type: "First-Party",
    badgeColor: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
  {
    name: "Evantra Headquarters",
    slug: "evantra-hq",
    description: "Architectural portal, telemetry console, and global workspace network.",
    status: "Verified Ecosystem App",
    scopes: ["openid", "profile", "email", "workspace:read"],
    type: "First-Party",
    badgeColor: "border-[#e6b24a]/25 bg-[#e6b24a]/10 text-[#fae59a]",
  },
];

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

        {/* Connected Applications List */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
              <ShieldCheck size={16} className="text-[#e6b24a]" />
              Registered OAuth Clients
            </div>
            <span className="text-xs text-white/40">{applications.length} Active</span>
          </div>

          <div className="space-y-4">
            {applications.map((application) => (
              <GlassCard
                key={application.name}
                variant="default"
                className="p-6 sm:p-7"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#e6b24a]/20 to-white/[0.02] text-lg font-bold text-[#fae59a]">
                        {application.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-lg font-semibold text-white">
                            {application.name}
                          </h2>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${application.badgeColor}`}
                          >
                            {application.type}
                          </span>
                        </div>

                        <p className="text-xs text-white/40">
                          client_id: <span className="font-mono text-white/60">client_{application.slug}</span>
                        </p>
                      </div>
                    </div>

                    <p className="max-w-2xl text-xs leading-relaxed text-white/60 sm:text-sm">
                      {application.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-white/40">Approved Scopes:</span>
                      {application.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-[#fae59a]"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/workspace/applications/new`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#e6b24a]/40 hover:text-[#fae59a]"
                    >
                      Configure
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
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
                  <code className="mx-1.5 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[#fae59a]">@evantra/identity-react</code>
                  SDK.
                </p>

                <div className="rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-white/80 overflow-x-auto">
                  <span className="text-purple-400">import</span> &#123; EvantraSignInButton &#125;{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-emerald-300">&quot;@evantra/identity-react&quot;</span>;
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