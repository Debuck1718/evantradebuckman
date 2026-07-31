"use client";

import FeaturedShowcase from "@/components/shared/FeaturedShowcase";
import { commerceCompany } from "@/data/companies/commerce";

export default function FeaturedPlatform() {
  return (
    <FeaturedShowcase
      {...commerceCompany.featuredShowcase}
    />
  );
}