"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { commerceCompany } from "@/data/companies/commerce";

export default function Solutions() {
  return (
    <CompanySection
      id="solutions"
      background="light"
    >
      <SectionHeading
        badge="Commerce Solutions"
        title="Empowering Businesses Through Modern Commerce Solutions"
        description="We engineer enterprise commerce solutions that help businesses launch, operate and scale through secure digital storefronts, intelligent payment systems, marketplace infrastructure, logistics platforms and data-driven business intelligence."
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
        {commerceCompany.solutions.map((solution, index) => (
          <FeatureCard
            key={solution.title}
            title={solution.title}
            description={solution.description}
            icon={solution.icon!}
            tags={solution.tags}
            featured={index === 0}
          />
        ))}
      </div>
    </CompanySection>
  );
}