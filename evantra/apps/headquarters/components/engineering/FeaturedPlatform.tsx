"use client";

import FeaturedShowcase from "@/components/shared/FeaturedShowcase";

import { engineeringCompany } from "@/data/companies/engineering";

export default function FeaturedPlatform() {
  return (
    <FeaturedShowcase
      {...engineeringCompany.featuredShowcase}
    />
  );
}