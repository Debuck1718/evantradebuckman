"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { commerceCompany } from "@/data/companies/commerce";

export default function Products() {
  return (
    <CompanySection
      id="products"
      background="gradient"
    >
      <SectionHeading
        badge="Commerce Products"
        title="Enterprise Commerce Platforms Built for Modern Business"
        description="Our commerce products combine enterprise engineering, secure payment infrastructure and intelligent automation to help organizations launch, manage and scale digital businesses with confidence."
        centered
        
      />

      <div
        className="
          mt-20
          grid
          gap-8
          lg:grid-cols-2
        "
      >
        {commerceCompany.products.map((product, index) => (
          <FeatureCard
            key={product.title}
            title={product.title}
            description={product.description}
            icon={product.icon!}
            tags={product.tags}
            featured={index === 0}
          />
        ))}
      </div>
    </CompanySection>
  );
}