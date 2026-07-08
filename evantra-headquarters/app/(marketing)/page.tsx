import { GlobalHeader, GlobalFooter } from "@/components/layout";

import HeroSection from "@/components/hero/HeroSection";

import { EcosystemSection } from "@/components/home/ecosystem";
import { FeaturedCompaniesSection } from "@/components/home/companies";
import { InnovationCampusSection } from "@/components/home/innovation-campus";
import { ResearchSection } from "@/components/home/research";
import { GlobalImpactSection } from "@/components/home/impact";
import { CallToActionSection } from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <GlobalHeader />

      <main>
        <HeroSection />

        <EcosystemSection />

        <FeaturedCompaniesSection />

        <InnovationCampusSection />

        <ResearchSection />

        <GlobalImpactSection />

        <CallToActionSection />
      </main>

      <GlobalFooter />
    </>
  );
}