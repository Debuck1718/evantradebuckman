import Link from "next/link";

import { IdentityShell } from "../../../components/identity/IdentityShell";

const submissions = [
  {
    title: "Consent copy clarity",
    area: "docs and terms",
    status: "Pending review",
    author: "Identity team",
    summary:
      "Revise consent language so third-party apps understand what profile claims they are requesting.",
  },
  {
    title: "Session export format",
    area: "security",
    status: "Needs triage",
    author: "Platform workers",
    summary:
      "Expose a clearer admin view for browser session metadata and revocation status.",
  },
  {
    title: "Developer onboarding page",
    area: "developer experience",
    status: "Approved",
    author: "Evantra labs",
    summary:
      "Add a dedicated page that explains client registration, redirect URI rules, and review expectations.",
  },
];

export default function AdminSubmissionsPage() {
  return (
    <IdentityShell
      title="Submission review"
      description="Track product suggestions and operational requests for Evantra Identity."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Review queue
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Suggestions should stay visible until they are resolved.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            This board helps workers triage ideas, standards updates, and operational requests before they are pushed into the product roadmap.
          </p>
        </div>

        <div className="grid gap-4">
          {submissions.map((submission) => (
            <article
              key={submission.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                    {submission.area}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-white">
                    {submission.title}
                  </h4>
                </div>
                <span className="rounded-full border border-[#e6b24a]/20 bg-[#e6b24a]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f5d48a]">
                  {submission.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/60">
                {submission.summary}
              </p>
              <p className="mt-4 text-xs text-white/35">
                Submitted by {submission.author}
              </p>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="rounded-xl bg-[#e6b24a] px-4 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
          >
            Back to admin
          </Link>
          <Link
            href="/developers/suggestions"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
          >
            Submit new suggestion
          </Link>
        </div>
      </div>
    </IdentityShell>
  );
}
