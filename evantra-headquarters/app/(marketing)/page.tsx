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