import Link from "next/link";

import { IdentityShell } from "../../components/identity/IdentityShell";

const responsibilities = [
  "Review approved clients and escalation notes.",
  "Monitor suggestion submissions and prioritize fixes.",
  "Coordinate policy changes with the kernel-backed workspace layer.",
  "Keep access and approval workflows auditable and minimal.",
];

export default function WorkersPage() {
  return (
    <IdentityShell
      title="Worker console"
      description="Operational guidance for Evantra workers supporting identity, approvals, and review queues."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Operations center
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Workers keep the platform moving safely.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            This page outlines the responsibilities of workers who review identity requests, support approvals, and help maintain production readiness.
          </p>
        </div>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <h4 className="text-lg font-semibold text-white">
            Core responsibilities
          </h4>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            {responsibilities.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#e6b24a]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <h4 className="text-lg font-semibold text-white">
              Worker controls
            </h4>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Worker tools should be limited to review, triage, and coordination. Final authorization policy belongs to the workspace layer.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <h4 className="text-lg font-semibold text-white">
              Quick links
            </h4>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="rounded-xl bg-[#e6b24a] px-4 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
              >
                Admin console
              </Link>
              <Link
                href="/developers"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Developer docs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </IdentityShell>
  );
}
