"use client";

import FeaturedShowcase from "@/components/shared/FeaturedShowcase";

import { cybersecurityCompany } from "@/data/companies/cybersecurity";

export default function FeaturedPlatform() {
  return (
    <FeaturedShowcase
      {...cybersecurityCompany.featuredShowcase}
    />
  );
}