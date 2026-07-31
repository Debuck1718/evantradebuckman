"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { engineeringCompany } from "@/data/companies/engineering";

export default function Solutions() {
  return (
    <CompanySection
      id="solutions"
      background="light"
    >
      <SectionHeading
        badge="Engineering Solutions"
        title="Engineering Intelligent Solutions for Industry and Infrastructure"
        description="We develop advanced engineering solutions that combine robotics, autonomous systems, embedded technologies and industrial intelligence to solve complex challenges across transportation, manufacturing, agriculture, environmental monitoring and smart infrastructure."
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
        {engineeringCompany.solutions.map((solution, index) => (
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