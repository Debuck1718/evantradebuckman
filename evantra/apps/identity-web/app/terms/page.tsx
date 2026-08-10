import Link from "next/link";

import { IdentityShell } from "../../components/identity/IdentityShell";

const terms = [
  {
    title: "Service usage",
    text:
      "Evantra Identity is provided for authentication, consent, and session lifecycle management. Do not use it to bypass application authorization or legal compliance requirements.",
  },
  {
    title: "Client obligations",
    text:
      "Clients must register accurate ownership data, use exact redirect URIs, protect secrets, and follow approval requirements before production use.",
  },
  {
    title: "Security expectations",
    text:
      "Consumers must store tokens and sessions securely, respect httpOnly cookies, and build their own role or permission checks where needed.",
  },
  {
    title: "Availability and changes",
    text:
      "Identity services, scopes, and policies may evolve. We may change flows or controls to improve security, compliance, or reliability.",
  },
];

export default function TermsPage() {
  return (
    <IdentityShell
      title="Terms and conditions"
      description="Production identity provider rules for Evantra Identity consumers, clients, and operators."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Operating terms
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Built for trust, auditability, and responsible use.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            These terms reflect the expectations of a production identity provider and should be reviewed before any application integrates with Evantra Identity.
          </p>
        </div>

        <div className="grid gap-4">
          {terms.map((term) => (
            <section
              key={term.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6"
            >
              <h4 className="text-lg font-semibold text-white">
                {term.title}
              </h4>
              <p className="mt-3 text-sm leading-6 text-white/60">
                {term.text}
              </p>
            </section>
          ))}
        </div>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <h4 className="text-lg font-semibold text-white">
            Acceptable use
          </h4>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            <li>• Do not impersonate another user or client.</li>
            <li>• Do not share secrets, tokens, or sessions outside authorized services.</li>
            <li>• Do not rely on identity for app-specific authorization decisions.</li>
            <li>• Use suggestions and review channels to propose improvements responsibly.</li>
          </ul>
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <h4 className="text-lg font-semibold text-white">
            Operator notes
          </h4>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Evantra workers and admins may use the admin review console to approve clients, review suggestions, and manage identity policy. Final workspace role decisions are enforced in the kernel-backed workspace layer.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-xl bg-[#e6b24a] px-4 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
            >
              Open admin console
            </Link>
            <Link
              href="/docs"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              Read docs
            </Link>
          </div>
        </section>
      </div>
    </IdentityShell>
  );
}
