"use client";

import FeaturedShowcase from "@/components/shared/FeaturedShowcase";

import { aiCompany } from "@/data/companies/ai";

export default function FeaturedPlatform() {
  return (
    <FeaturedShowcase
      {...aiCompany.featuredShowcase}
    />
  );
}