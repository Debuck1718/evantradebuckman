import Link from "next/link";

import { IdentityShell } from "../../../components/identity/IdentityShell";

export default function AdminClientsPage() {
  return (
    <IdentityShell
      title="Client review"
      description="Approve, audit, and govern OAuth clients before production access."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Approval workflow
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Production clients stay pending until approved.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Review ownership, redirect URIs, intended scopes, and support contacts before activating a client.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <h4 className="text-lg font-semibold text-white">
              Review checklist
            </h4>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
              <li>• Confirm the owner account and business purpose.</li>
              <li>• Verify exact redirect URIs and PKCE support.</li>
              <li>• Validate requested scopes and data access level.</li>
              <li>• Confirm escalation and support contact details.</li>
            </ul>
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <h4 className="text-lg font-semibold text-white">
              Approval actions
            </h4>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Use the secured approval endpoint from your internal tools or automation pipeline. The approval key must remain private to Evantra operators.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="rounded-xl bg-[#e6b24a] px-4 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
              >
                Back to admin
              </Link>
              <Link
                href="/docs"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Read standards
              </Link>
            </div>
          </section>
        </div>
      </div>
    </IdentityShell>
  );
}
