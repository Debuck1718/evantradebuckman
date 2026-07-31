"use client";

import CompanyHero from "@/components/shared/CompanyHero";
import { cybersecurityCompany } from "@/data/companies/cybersecurity";

export default function Hero() {
  return (
    <CompanyHero
      badge={cybersecurityCompany.hero.badge}
      title={cybersecurityCompany.hero.title}
      description={cybersecurityCompany.hero.description}
      image={cybersecurityCompany.hero.image}
      primaryAction={cybersecurityCompany.hero.primaryAction}
      secondaryAction={cybersecurityCompany.hero.secondaryAction}
      metrics={cybersecurityCompany.hero.metrics}
    />
  );
}