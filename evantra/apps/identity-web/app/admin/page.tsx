import Link from "next/link";

import { IdentityShell } from "../../components/identity/IdentityShell";

const areas = [
  {
    title: "Client review",
    description:
      "Review new OAuth applications, approval status, and onboarding policy.",
    href: "/admin/clients",
  },
  {
    title: "Suggestion board",
    description:
      "View developer and worker suggestions for improvements to Evantra Identity.",
    href: "/admin/submissions",
  },
  {
    title: "Workspace controls",
    description:
      "Worker/admin access belongs in the final kernel-backed workspace layer.",
    href: "/workspace/account",
  },
];

export default function AdminPage() {
  return (
    <IdentityShell
      title="Admin console"
      description="Operational controls for Evantra workers and admins."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Worker operations
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Review policy, not just identity events.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Evantra Identity handles authentication and consent. Worker and admin decisions are surfaced here and should be finalized in the kernel-backed workspace where broader role policy lives.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {areas.map((area) => (
            <section
              key={area.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6"
            >
              <h4 className="text-lg font-semibold text-white">
                {area.title}
              </h4>
              <p className="mt-3 text-sm leading-6 text-white/60">
                {area.description}
              </p>
              <Link
                href={area.href}
                className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Open
              </Link>
            </section>
          ))}
        </div>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <h4 className="text-lg font-semibold text-white">
            Admin policy notes
          </h4>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            <li>• Use the approval endpoint only for vetted clients.</li>
            <li>• First-party auto-approval should be tightly controlled by environment policy.</li>
            <li>• Suggestions from developers should be reviewed before rollout.</li>
            <li>• Identity does not perform application-level role enforcement.</li>
          </ul>
        </section>
      </div>
    </IdentityShell>
  );
}
