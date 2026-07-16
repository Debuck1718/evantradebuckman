"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { innovationCompany } from "@/data/companies/innovation";

export default function Products() {
  return (
    <CompanySection
      id="products"
      background="gradient"
    >
      <SectionHeading
        badge="Innovation Platforms"
        title="Turning Research Into Transformative Products"
        description="Our innovation platforms accelerate the journey from breakthrough ideas to validated products, scalable ventures and technologies that create lasting global impact."
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
        {innovationCompany.products.map((product, index) => (
          <FeatureCard
            key={product.title}
            title={product.title}
            description={product.description}
            icon={product.icon}
            tags={product.tags}
            featured={index === 0}
          />
        ))}
      </div>
    </CompanySection>
  );
}