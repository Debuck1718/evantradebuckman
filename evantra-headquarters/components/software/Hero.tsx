"use client";

import CompanyHero from "@/components/shared/CompanyHero";

import { softwareCompany } from "@/data/companies";

export default function Hero() {
  return (
    <CompanyHero
      {...softwareCompany.hero}
      theme="software"
      showMetrics
      animatedGrid
      showParticles
      glassIntensity="high"
    />
  );
}