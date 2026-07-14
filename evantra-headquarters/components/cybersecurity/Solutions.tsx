"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { cybersecurityCompany } from "@/data/companies/cybersecurity";

export default function Solutions() {
  return (
    <CompanySection
      id="solutions"
      background="light"
    >
      <SectionHeading
        badge="Solutions"
        title="Cybersecurity Solutions Across Critical Industries"
        description="We secure governments, enterprises and critical infrastructure through resilient cybersecurity engineering, intelligent monitoring and Zero Trust security strategies."
        centered
      />

      <div
        className="
          mt-20
          grid
          gap-8
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {cybersecurityCompany.solutions.map((solution, index) => (
          <FeatureCard
            key={solution.title}
            title={solution.title}
            description={solution.description}
            icon={solution.icon}
            tags={solution.tags}
            featured={index === 0}
          />
        ))}
      </div>
    </CompanySection>
  );
}