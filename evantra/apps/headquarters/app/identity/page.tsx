import Link from "next/link";

import { GlobalFooter, GlobalHeader } from "@/components/layout";

const identityWebUrl =
  process.env.NEXT_PUBLIC_IDENTITY_WEB_URL ??
  "https://identity.evantradebuckman.com";

const workspaceWebUrl =
  process.env.NEXT_PUBLIC_WORKSPACE_WEB_URL ??
  "https://workspace.evantradebuckman.com";

const pillars = [
  {
    title: "Authentication",
    description:
      "A secure entry point for Evantra users with cookie-backed browser sessions and consistent sign-in flows.",
  },
  {
    title: "Developer onboarding",
    description:
      "Clear client registration, redirect URI review, and production approval for approved applications.",
  },
  {
    title: "Worker operations",
    description:
      "Admin and worker workflows for reviews, escalation, and policy oversight in the public stack.",
  },
  {
    title: "Governance",
    description:
      "Terms, rules, and documentation that keep the identity layer understandable and auditable.",
  },
];

export default function IdentityPage() {
  return (
    <>
      <GlobalHeader />

      <main className="relative overflow-hidden bg-[#06131F] text-white">
        <section className="relative isolate overflow-hidden px-6 pb-24 pt-36 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,178,74,.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(11,79,113,.28),transparent_32%)]" />
          <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div className="relative max-w-3xl">
              <span className="inline-flex rounded-full border border-ev-gold/25 bg-ev-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-ev-gold">
                Evantra Identity
              </span>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                One identity layer for the entire Evantra ecosystem.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                This is the public-facing identity entrance for Evantra. It introduces the authentication system, the developer standards, and the operational rules that keep the platform production ready.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`${identityWebUrl}/register`}
                  className="btn-glow"
                >
                  Create account
                </Link>
                <Link
                  href={`${identityWebUrl}/login`}
                  className="btn-outline"
                >
                  Sign in
                </Link>
                <Link
                  href={`${workspaceWebUrl}/workspace/account`}
                  className="btn-outline"
                >
                  Open workspace
                </Link>
                <Link href="/" className="btn-outline">
                  Back to headquarters
                </Link>
              </div>
            </div>

            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_90px_rgba(0,0,0,.28)] backdrop-blur-2xl">
              <div className="grid gap-4 sm:grid-cols-2">
                {pillars.map((pillar) => (
                  <article
                    key={pillar.title}
                    className="rounded-[1.5rem] border border-white/10 bg-[#081521]/80 p-5"
                  >
                    <h2 className="text-lg font-semibold text-white">
                      {pillar.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/65">
                      {pillar.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="docs" className="border-t border-white/10 px-6 py-24 lg:px-10">
          <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-3">
            <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ev-gold">
                Users
              </p>
              <h2 className="mt-4 text-2xl font-semibold">Sign in with confidence.</h2>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Sessions are managed with secure browser cookies and consistent validation across Evantra services.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`${identityWebUrl}/login`}
                  className="rounded-xl bg-[#e6b24a] px-4 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
                >
                  Sign in
                </Link>
                <Link
                  href={`${identityWebUrl}/register`}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  Create account
                </Link>
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ev-gold">
                Developers
              </p>
              <h2 className="mt-4 text-2xl font-semibold">Integrate the right way.</h2>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Register clients, review terms, and build with explicit separation between identity and authorization.
              </p>
              <div className="mt-6">
                <Link
                  href={`${identityWebUrl}/developers`}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  Developer portal
                </Link>
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ev-gold">
                Operators
              </p>
              <h2 className="mt-4 text-2xl font-semibold">Keep governance visible.</h2>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Use the review and approval path to manage clients, suggestions, and policy changes responsibly.
              </p>
              <div className="mt-6">
                <Link
                  href={`${workspaceWebUrl}/workspace/account`}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  Workspace account
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}