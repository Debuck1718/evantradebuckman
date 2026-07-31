"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { aiCompany } from "@/data/companies/ai";

export default function Solutions() {
  return (
    <CompanySection
      id="solutions"
      background="light"
    >
      <SectionHeading
        badge="AI Solutions"
        title="Transforming Industries Through Applied Artificial Intelligence"
        description="We engineer intelligent AI solutions that empower organizations to automate operations, enhance decision-making and deliver better experiences across healthcare, education, enterprise, government and industry."
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
        {aiCompany.solutions.map((solution, index) => (
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