"use client";

import CompanyHero from "@/components/shared/CompanyHero";

import { commerceCompany } from "@/data/companies/commerce";

export default function Hero() {
  return (
    <CompanyHero
      badge={commerceCompany.hero.badge}
      title={commerceCompany.hero.title}
      description={commerceCompany.hero.description}
      image={commerceCompany.hero.image}
      primaryAction={commerceCompany.hero.primaryAction}
      secondaryAction={commerceCompany.hero.secondaryAction}
      metrics={commerceCompany.hero.metrics}
      theme="commerce"
      animatedGrid
      showParticles
      glassIntensity="high"
    />
  );
}