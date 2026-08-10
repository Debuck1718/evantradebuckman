import Link from "next/link";

import { IdentityShell } from "../../components/identity/IdentityShell";

const steps = [
  {
    title: "1. Register your client",
    description:
      "Create a client for your application and define ownership, name, slug, and secret lifecycle.",
  },
  {
    title: "2. Add redirect URIs",
    description:
      "Register exact redirect URIs. Production integrations should never rely on loosely matched callbacks.",
  },
  {
    title: "3. Use OAuth code + PKCE",
    description:
      "Use authorization code flow with PKCE for browser and public clients. Keep tokens server-side.",
  },
  {
    title: "4. Handle lifecycle events",
    description:
      "Support refresh, revoke, logout, and session validation from the backend layer of your product.",
  },
];

export default function DevelopersPage() {
  return (
    <IdentityShell
      title="Developer integration"
      description="How to integrate Evantra Identity safely into first-party and approved third-party apps."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Integration path
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Keep identity simple. Keep authorization in your app.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Evantra Identity gives you authentication, consent, and session management. Your application should own its own permissions, teams, and product-specific access logic.
          </p>
        </div>

        <div className="grid gap-4">
          {steps.map((step) => (
            <section
              key={step.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6"
            >
              <h4 className="text-lg font-semibold text-white">
                {step.title}
              </h4>
              <p className="mt-3 text-sm leading-6 text-white/60">
                {step.description}
              </p>
            </section>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Best practices
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
              <li>Use the secure session cookie returned after authentication.</li>
              <li>Validate state, redirect URIs, and PKCE challenges every time.</li>
              <li>Store secrets on the server and rotate them periodically.</li>
              <li>Use userinfo for identity claims, not for authorization decisions.</li>
            </ul>
          </section>

          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Submission and support
            </p>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Share integration feedback, missing endpoints, or workflow suggestions so Evantra workers can improve the identity platform.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/developers/integration-kit"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Integration kit
              </Link>
              <Link
                href="/developers/suggestions"
                className="rounded-xl bg-[#e6b24a] px-4 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
              >
                Submit feedback
              </Link>
              <Link
                href="/docs"
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Read documentation
              </Link>
            </div>
          </section>
        </div>
      </div>
    </IdentityShell>
  );
}
