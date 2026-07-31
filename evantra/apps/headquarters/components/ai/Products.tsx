"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { aiCompany } from "@/data/companies/ai";

export default function Products() {
  return (
    <CompanySection
      id="products"
      background="gradient"
    >
      <SectionHeading
        badge="AI Products"
        title="Artificial Intelligence Platforms Built for Real Impact"
        description="Our AI products combine cutting-edge research with practical engineering to solve complex challenges across healthcare, enterprise, education and public services."
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
        {aiCompany.products.map((product, index) => (
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