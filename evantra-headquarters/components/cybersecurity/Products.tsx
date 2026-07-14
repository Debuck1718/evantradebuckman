"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { cybersecurityCompany } from "@/data/companies/cybersecurity";

export default function Products() {
  return (
    <CompanySection
      id="products"
      background="light"
    >
      <SectionHeading
        badge="Products"
        title="Security Platforms Built for the Future"
        description="Our cybersecurity products combine engineering excellence, responsible security and intelligent automation to help organizations stay resilient."
        centered
      />

      <div
        className="
          mt-20
          grid
          gap-8
          md:grid-cols-2
        "
      >
        {cybersecurityCompany.products.map((product, index) => (
          <FeatureCard
            key={product.title}
            title={product.title}
            description={product.description}
            icon={product.icon}
            tags={[
              ...(product.tags ?? []),
              product.status ?? "",
            ].filter(Boolean)}
            featured={index === 0}
          />
        ))}
      </div>
    </CompanySection>
  );
}