"use client";

import CompanyHero from "@/components/shared/CompanyHero";

import { aiCompany } from "@/data/companies/ai";

export default function Hero() {
  return (
    <CompanyHero
      badge={aiCompany.hero.badge}
      title={aiCompany.hero.title}
      description={aiCompany.hero.description}
      image={aiCompany.hero.image}
      primaryAction={aiCompany.hero.primaryAction}
      secondaryAction={aiCompany.hero.secondaryAction}
      metrics={aiCompany.hero.metrics}
      theme="ai"
      animatedGrid
      showParticles
      glassIntensity="high"
    />
  );
}