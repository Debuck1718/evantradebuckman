"use client";

import CompanyHero from "@/components/shared/CompanyHero";

import { engineeringCompany } from "@/data/companies/engineering";

export default function Hero() {
  return (
    <CompanyHero
      badge={engineeringCompany.hero.badge}
      title={engineeringCompany.hero.title}
      description={engineeringCompany.hero.description}
      image={engineeringCompany.hero.image}
      primaryAction={engineeringCompany.hero.primaryAction}
      secondaryAction={engineeringCompany.hero.secondaryAction}
      metrics={engineeringCompany.hero.metrics}
      theme="engineering"
      animatedGrid
      showParticles
      glassIntensity="high"
    />
  );
}