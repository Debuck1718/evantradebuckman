import Link from "next/link";

import { GlobalHeader, GlobalFooter } from "@/components/layout";

import HeroSection from "@/components/hero/HeroSection";

import { EcosystemSection } from "@/components/home/ecosystem";
import { FeaturedCompaniesSection } from "@/components/home/companies";
import { InnovationCampusSection } from "@/components/home/innovation-campus";
import { ResearchSection } from "@/components/home/research";
import { GlobalImpactSection } from "@/components/home/impact";
import { CallToActionSection } from "@/components/home/cta";

import { CampusNavigator } from "@/components/campus";

export default function HomePage() {
  return (
    <>
      {/* ================================================= */}
      {/* Global Header */}
      {/* ================================================= */}

      <GlobalHeader />

      {/* ================================================= */}
      {/* Main Content */}
      {/* ================================================= */}

      <main
        id="main-content"
        className="relative overflow-x-hidden"
      >
        {/* Hero */}

        <HeroSection />

        {/* Business Ecosystem */}

        <EcosystemSection />

        {/* Evantra Identity */}

        <section className="relative overflow-hidden border-y border-white/10 bg-[#081521] py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,178,74,.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(11,79,113,.24),transparent_34%)]" />

          <div className="relative mx-auto grid max-w-[1440px] gap-10 px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-ev-gold/25 bg-ev-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-ev-gold">
                Evantra Identity
              </span>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                A secure public front door for users, developers, and operators.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/72">
                Evantra Identity is the centralized login, consent, and session layer for the Evantra ecosystem. It keeps authentication consistent while leaving product-specific permissions inside each application.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/identity" className="btn-glow">
                  Open Identity
                </Link>
                <Link href="/identity#docs" className="btn-outline">
                  View standards
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white">Users</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Sign in, manage sessions, and move safely between Evantra services.
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white">Developers</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Register clients, review identity rules, and integrate with OAuth flows.
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white">Workers</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Review approvals, suggestions, and operational policy with clear accountability.
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white">Terms</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Keep production identity use governed by documented rules and review.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Featured Centers */}

        <FeaturedCompaniesSection />

        {/* Innovation Campus */}

        <InnovationCampusSection />

        {/* Interactive Campus */}

        <CampusNavigator />

        {/* Research */}

        <ResearchSection />

        {/* Global Impact */}

        <GlobalImpactSection />

        {/* Call To Action */}

        <CallToActionSection />
      </main>

      {/* ================================================= */}
      {/* Global Footer */}
      {/* ================================================= */}

      <GlobalFooter />
    </>
  );
}