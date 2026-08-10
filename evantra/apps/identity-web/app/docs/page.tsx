import Link from "next/link";

import { IdentityShell } from "../../components/identity/IdentityShell";

const sections = [
  {
    title: "Rules and regulations",
    items: [
      "Use Evantra Identity only for lawful, authorized access.",
      "Applications must register exact redirect URIs and rotate secrets responsibly.",
      "Identity does not replace application-level authorization. Each application owns its own role checks.",
      "Do not store access tokens or session cookies in unsafe client storage.",
    ],
  },
  {
    title: "Usage guide",
    items: [
      "Register a client, add redirect URIs, and request the scopes you actually need.",
      "Use the authorization code flow with PKCE for browser-based integrations.",
      "Call token, refresh, revoke, and userinfo endpoints from the backend side of your application.",
      "Keep your logout and session validation flows aligned with the httpOnly Evantra session cookie.",
    ],
  },
  {
    title: "Strengths",
    items: [
      "Centralized identity for Evantra and partner applications.",
      "Session-aware OAuth flow with secure cookie-backed browser state.",
      "Clear separation between identity, authorization, and application roles.",
      "Admin-controlled client onboarding for production safety.",
    ],
  },
  {
    title: "Importance",
    items: [
      "Protects users with a consistent login and consent experience.",
      "Reduces duplicated authentication logic across applications.",
      "Improves auditability for sign-in, consent, and client onboarding.",
      "Creates a stable foundation for first-party and approved third-party apps.",
    ],
  },
];

export default function DocsPage() {
  return (
    <IdentityShell
      title="Identity documentation"
      description="Rules, usage guidance, and review standards for Evantra Identity integrations."
    >
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
            Developer standards
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Build with clarity, security, and explicit responsibility.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Evantra Identity is the authentication layer. Your application remains responsible for authorization, permissions, and business-specific access control.
          </p>
        </div>

        <div className="grid gap-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6"
            >
              <h4 className="text-lg font-semibold text-white">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#e6b24a]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Review channel
            </p>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Feature requests, integration concerns, and security suggestions can be submitted for Evantra workers to review.
            </p>
            <Link
              href="/developers/suggestions"
              className="mt-5 inline-flex rounded-xl bg-[#e6b24a] px-4 py-2.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
            >
              Submit a suggestion
            </Link>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Terms and regulations
            </p>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Review the identity terms before integrating or onboarding applications into production.
            </p>
            <Link
              href="/terms"
              className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              Read terms
            </Link>
          </div>
        </div>
      </div>
    </IdentityShell>
  );
}
