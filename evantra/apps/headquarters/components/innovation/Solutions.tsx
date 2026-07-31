"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { innovationCompany } from "@/data/companies/innovation";

export default function Solutions() {
  return (
    <CompanySection
      id="solutions"
      background="light"
    >
      <SectionHeading
        badge="Innovation Solutions"
        title="Transforming Emerging Technologies into Real-World Solutions"
        description="We transform breakthrough research, emerging technologies and bold ideas into practical solutions that accelerate digital transformation, improve industries and create lasting societal impact."
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
        {innovationCompany.solutions.map((solution, index) => (
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