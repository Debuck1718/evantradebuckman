"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { engineeringCompany } from "@/data/companies/engineering";

export default function Products() {
  return (
    <CompanySection
      id="products"
      background="gradient"
    >
      <SectionHeading
        badge="Engineering Products"
        title="Engineering Platforms Built for Intelligent Infrastructure"
        description="Our engineering platforms combine robotics, autonomous systems, industrial IoT and intelligent automation to solve real-world engineering challenges across industries and critical infrastructure."
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
        {engineeringCompany.products.map((product, index) => (
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