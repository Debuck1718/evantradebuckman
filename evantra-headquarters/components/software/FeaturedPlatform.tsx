"use client";

import FeaturedShowcase from "@/components/shared/FeaturedShowcase";

import { softwareCompany } from "@/data/companies/software";

export default function FeaturedPlatform() {
  return (
    <FeaturedShowcase
      {...softwareCompany.featuredShowcase}
    />
  );
}