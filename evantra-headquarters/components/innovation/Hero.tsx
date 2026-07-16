"use client";

import CompanyHero from "@/components/shared/CompanyHero";

import { innovationCompany } from "@/data/companies/innovation";

export default function Hero() {
  return (
    <CompanyHero
      badge={innovationCompany.hero.badge}
      title={innovationCompany.hero.title}
      description={innovationCompany.hero.description}
      image={innovationCompany.hero.image}
      primaryAction={innovationCompany.hero.primaryAction}
      secondaryAction={innovationCompany.hero.secondaryAction}
      metrics={innovationCompany.hero.metrics}
      theme="innovation"
      animatedGrid
      showParticles
      glassIntensity="high"
    />
  );
}