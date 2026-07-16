"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { innovationCompany } from "@/data/companies/innovation";

export default function Capabilities() {
  return (
    <CompanySection
      id="capabilities"
      background="gradient"
    >
      <SectionHeading
        badge="Innovation Capabilities"
        title="Transforming Bold Ideas into Tomorrow's Technologies"
        description="From emerging technologies and rapid prototyping to research commercialization and venture incubation, we transform visionary concepts into practical innovations with global impact."
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
        {innovationCompany.capabilities.map((capability, index) => (
          <FeatureCard
            key={capability.title}
            title={capability.title}
            description={capability.description}
            icon={capability.icon}
            tags={capability.tags}
            featured={index === 0}
          />
        ))}
      </div>
    </CompanySection>
  );
}