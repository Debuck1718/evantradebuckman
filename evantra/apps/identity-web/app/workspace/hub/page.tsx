"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Bot,
  Calendar,
  CheckCircle2,
  FileText,
  Grid2X2,
  KeyRound,
  Layers,
  Loader2,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
  Zap,
} from "lucide-react";

import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";
import { EvantraBrandIcon } from "../../../components/brand/EvantraBrandIcon";
import { GlassCard } from "../../../components/ui/GlassCard";
import { type LifeWorkPlan } from "../lib/intelligence";

const kernelModules = [
  {
    title: "Zero-Knowledge Vault",
    tagline: "Cryptographic Safe & Keyring",
    description:
      "Native zero-knowledge document and credential storage. Secure contracts, credentials, and identity records under your master key.",
    icon: Lock,
    href: "/workspace/account",
    badge: "Native Security",
    accent: "from-amber-500/20 to-[#e6b24a]/5",
  },
  {
    title: "Promise Graph",
    tagline: "Bilateral Accountability",
    description:
      "Track every promise and commitment with explicit accountability, due dates, renegotiation histories, and trust ratings.",
    icon: Target,
    href: "/workspace/promises",
    badge: "Trust Engine",
    accent: "from-blue-500/20 to-cyan-500/5",
  },
  {
    title: "Burden Intelligence",
    tagline: "Cognitive Load & Energy",
    description:
      "Continuously monitors workload strain, context switches, and meeting density to enforce protective focus guardrails.",
    icon: BrainCircuit,
    href: "/workspace/burden",
    badge: "Burnout Defense",
    accent: "from-emerald-500/20 to-teal-500/5",
  },
  {
    title: "Neural Knowledge",
    tagline: "Interconnected Second Brain",
    description:
      "A bidirectional idea and research graph. Link insights, project notes, and architectural decisions without SaaS silos.",
    icon: FileText,
    href: "/workspace/knowledge",
    badge: "Knowledge Graph",
    accent: "from-purple-500/20 to-indigo-500/5",
  },
  {
    title: "Temporal Planner",
    tagline: "Deep Work Allocation",
    description:
      "Orchestrates daily focus blocks, buffers recovery windows, and shields high-priority creative time from meeting overload.",
    icon: Calendar,
    href: "/workspace/calendar",
    badge: "Orchestrator",
    accent: "from-rose-500/20 to-orange-500/5",
  },
  {
    title: "OAuth & Developer Hub",
    tagline: "First-Party SSO & API Keys",
    description:
      "Register OAuth 2.0 / OIDC clients, issue API access tokens, and integrate third-party apps seamlessly into Evantra Identity.",
    icon: KeyRound,
    href: "/workspace/applications",
    badge: "Ecosystem Portal",
    accent: "from-[#e6b24a]/20 to-amber-500/5",
  },
  {
    title: "Financial Ledger",
    tagline: "Decision-Ready Money Signals",
    description: "Record income and expenses, see your running balance, and keep financial context close to your operating plan.",
    icon: WalletCards,
    href: "/workspace/finance",
    badge: "Finance",
    accent: "from-cyan-500/20 to-blue-500/5",
  },
  {
    title: "Workspace Assistant",
    tagline: "Context Into Action",
    description: "Ask grounded questions across your priorities, promises, knowledge, calendar, and financial signals.",
    icon: Bot,
    href: "/workspace/assistant",
    badge: "Kernel Guide",
    accent: "from-fuchsia-500/20 to-rose-500/5",
  },
];

const starterActions = [
  {
    text: "Ask the Workspace Assistant to turn your current context into clear next actions.",
    href: "/workspace/assistant",
  },
  {
    text: "Review current Burden Score to detect cognitive overload before performance drops.",
    href: "/workspace/burden",
  },
  {
    text: "Log your top 3 commitments in the Promise Graph for the upcoming 72-hour window.",
    href: "/workspace/promises",
  },
  {
    text: "Generate your daily Life-Work Operating Plan with automatic focus guardrails.",
    href: "/workspace/plan",
  },
  {
    text: "Register an OAuth Client to let developer applications authenticate with your Evantra ID.",
    href: "/workspace/applications/new",
  },
];

export default function WorkspaceHubPage() {
  const { account, session, loading } = useIdentitySession();
  const [plan, setPlan] = useState<LifeWorkPlan | null>(null);

  useEffect(() => {
    async function loadPlan(): Promise<void> {
      try {
        const response = await fetch(
          "/api/workspace/plan",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { plan: LifeWorkPlan };
        setPlan(payload.plan);
      } catch {
        setPlan(null);
      }
    }

    if (session) {
      void loadPlan();
    }
  }, [session]);

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
      <main className="text-white">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center justify-center px-6">
          <GlassCard variant="elevated" className="w-full p-8 text-center sm:p-10">
            <EvantraBrandIcon size={48} className="mx-auto" />
            <h1 className="mt-6 text-2xl font-semibold">Sign in required</h1>
            <p className="mt-3 text-sm text-white/50">
              Sign in to enter the Evantra Workspace OS command center.
            </p>
            <Link
              href="/login?returnTo=/workspace/hub"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
            >
              Sign in with Evantra ID
            </Link>
          </GlassCard>
        </div>
      </main>
    );
  }

  const burdenScore = plan?.burden.score ?? 28;
  const burdenBand = plan?.burden.band ?? "sustainable";

  const getBandStyles = (band: string) => {
    switch (band) {
      case "critical":
        return {
          textColor: "text-red-300",
          bgColor: "bg-red-400/10 border-red-400/30",
          barColor: "bg-gradient-to-r from-amber-400 to-red-500",
          label: "Critical Strain",
        };
      case "high":
        return {
          textColor: "text-amber-300",
          bgColor: "bg-amber-400/10 border-amber-400/30",
          barColor: "bg-gradient-to-r from-yellow-400 to-amber-500",
          label: "Elevated Load",
        };
      case "moderate":
        return {
          textColor: "text-yellow-200",
          bgColor: "bg-yellow-400/10 border-yellow-400/30",
          barColor: "bg-gradient-to-r from-teal-400 to-yellow-400",
          label: "Moderate Activity",
        };
      default:
        return {
          textColor: "text-emerald-300",
          bgColor: "bg-emerald-400/10 border-emerald-400/30",
          barColor: "bg-gradient-to-r from-[#fae59a] to-emerald-400",
          label: "Optimal & Sustainable",
        };
    }
  };

  const bandStyles = getBandStyles(burdenBand);

  return (
    <main className="text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-10">
        {/* Executive Hero Banner */}
        <GlassCard
          variant="gold"
          className="mb-8 border-[#e6b24a]/25 bg-gradient-to-br from-[#0b4f71]/30 via-[#06131f] to-[#071826] p-6 sm:p-8 lg:p-10"
          hover={false}
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#fae59a]">
                  <Zap size={12} className="text-[#e6b24a]" />
                  Evantra Workspace OS
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Kernel 1.0 Active
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl">
                Command center for{" "}
                <span className="bg-gradient-to-r from-[#fae59a] via-[#e6b24a] to-[#c99322] bg-clip-text text-transparent">
                  {account.firstName} {account.lastName}
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                Your native operating system for life, work, and identity. Backed by the
                Evantra Kernel with zero-knowledge security, cognitive burden defense, and
                promise accountability.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:shrink-0 xl:flex-col">
              <Link
                href="/workspace/promises"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] shadow-lg shadow-[#e6b24a]/10 transition hover:-translate-y-0.5 hover:bg-[#f0c261]"
              >
                <Plus size={16} />
                <span>Capture Promise</span>
              </Link>

              <Link
                href="/workspace/burden"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <BrainCircuit size={16} className="text-[#e6b24a]" />
                <span>Run Burden Scan</span>
              </Link>
            </div>
          </div>
        </GlassCard>

        {/* Live Telemetry Cockpit */}
        <section className="mb-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[#e6b24a]" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
                Live Intelligence Telemetry
              </h2>
            </div>

            <Link
              href="/workspace/plan"
              className="text-xs font-medium text-[#e6b24a] transition hover:text-[#fae59a] hover:underline"
            >
              View Full Life-Work Plan &rarr;
            </Link>
          </div>

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
            {/* Burden Meter Card */}
            <GlassCard variant="default" className="flex flex-col justify-between p-6" hover={false}>
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    Burden Index
                  </span>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${bandStyles.bgColor} ${bandStyles.textColor}`}
                  >
                    {bandStyles.label}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {burdenScore}
                  </span>
                  <span className="text-xs text-white/40">/ 100 max</span>
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${bandStyles.barColor}`}
                    style={{ width: `${Math.min(Math.max(burdenScore, 5), 100)}%` }}
                  />
                </div>

                <p className="mt-4 text-xs leading-5 text-white/50">
                  Calculated from active tasks, meeting saturation, and upcoming commitments.
                </p>
              </div>

              <Link
                href="/workspace/burden"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#e6b24a] hover:text-[#fae59a]"
              >
                <span>Adjust workload inputs</span>
                <span>&rarr;</span>
              </Link>
            </GlassCard>

            {/* Promises Due Card */}
            <GlassCard variant="default" className="flex flex-col justify-between p-6" hover={false}>
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    Promise Graph
                  </span>
                  <span className="shrink-0 rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-300">
                    72h Window
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-white">
                    {plan?.promisesDueSoon.length ?? 0}
                  </span>
                  <span className="text-xs text-white/40">commitments pending</span>
                </div>

                <div className="mt-4 space-y-2">
                  {plan?.promisesDueSoon && plan.promisesDueSoon.length > 0 ? (
                    plan.promisesDueSoon.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="truncate rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-xs text-white/80"
                      >
                        â€¢ {item.title}
                      </div>
                    ))
                  ) : (
                    <p className="py-2 text-xs italic text-white/40">
                      No commitments due in the next 72 hours.
                    </p>
                  )}
                </div>
              </div>

              <Link
                href="/workspace/promises"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#e6b24a] hover:text-[#fae59a]"
              >
                <span>Manage commitments</span>
                <span>&rarr;</span>
              </Link>
            </GlassCard>

            {/* Guardrails Card */}
            <GlassCard variant="default" className="flex flex-col justify-between p-6" hover={false}>
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    Cognitive Guardrails
                  </span>
                  <span className="shrink-0 rounded-full border border-purple-400/20 bg-purple-400/10 px-2.5 py-0.5 text-[11px] font-medium text-purple-300">
                    Active
                  </span>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-white/70">
                  {plan?.guardrails && plan.guardrails.length > 0
                    ? plan.guardrails[0]
                    : "Workload is well-calibrated. Focus on core high-leverage milestones."}
                </p>

                <div className="mt-3 rounded-xl border border-[#e6b24a]/20 bg-[#e6b24a]/[0.03] p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#fae59a]">
                    <Sparkles size={13} />
                    <span>Focus Shield Active</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/50">
                    Meeting buffers &amp; deep-work blocks protected.
                  </p>
                </div>
              </div>

              <Link
                href="/workspace/plan"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#e6b24a] hover:text-[#fae59a]"
              >
                <span>Open full operating plan</span>
                <span>&rarr;</span>
              </Link>
            </GlassCard>
          </div>
        </section>

        {/* First-Party Native Kernel Workspace Applications Suite */}
        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div className="flex items-center gap-2">
              <Grid2X2 size={16} className="text-[#e6b24a]" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
                Workspace Applications
              </h2>
            </div>
            <span className="text-xs text-white/40">Included with your Evantra ID</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {kernelModules.map((module) => {
              const Icon = module.icon;

              return (
                <Link key={module.title} href={module.href} className="group block">
                  <GlassCard
                    variant="default"
                    className="h-full p-5 transition-all duration-300 group-hover:border-[#e6b24a]/40 sm:p-6"
                    hover={false}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${module.accent}`}
                      >
                        <Icon size={20} className="text-[#fae59a]" />
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/40 transition group-hover:border-[#e6b24a]/30 group-hover:text-[#fae59a]">
                        {module.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-white transition group-hover:text-[#fae59a]">
                      {module.title}
                    </h3>
                    <p className="text-xs font-medium text-[#e6b24a]/80">{module.tagline}</p>

                    <p className="mt-3 text-xs leading-relaxed text-white/55">
                      {module.description}
                    </p>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Daily Operating Playbook */}
        <GlassCard variant="default" className="p-6 sm:p-8" hover={false}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
              <CheckCircle2 size={20} className="text-[#e6b24a]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold">Daily Operating Protocol</h3>
              <p className="text-xs text-white/40">
                Actionable guidelines to maximize cognitive clarity and output
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {starterActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-[#e6b24a]/30 hover:bg-white/[0.04]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-[#fae59a] transition group-hover:bg-[#e6b24a] group-hover:text-[#06131f]">
                  {index + 1}
                </span>
                <p className="text-xs leading-5 text-white/70 transition group-hover:text-white">
                  {action.text}
                </p>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
