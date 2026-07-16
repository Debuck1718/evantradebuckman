"use client";

import FeaturedShowcase from "@/components/shared/FeaturedShowcase";

import { innovationCompany } from "@/data/companies/innovation";

export default function FeaturedPlatform() {
  return (
    <FeaturedShowcase
      {...innovationCompany.featuredShowcase}
    />
  );
}