"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { engineeringCompany } from "@/data/companies/engineering";

export default function Capabilities() {
  return (
    <CompanySection
      id="capabilities"
      background="gradient"
    >
      <SectionHeading
        badge="Engineering Capabilities"
        title="Engineering Intelligent Systems That Power the Physical World"
        description="From autonomous systems and robotics to embedded technologies, industrial IoT and smart infrastructure, we engineer advanced technologies that solve complex engineering challenges across industries."
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
        {engineeringCompany.capabilities.map((capability, index) => (
          <FeatureCard
            key={capability.title}
            title={capability.title}
            description={capability.description}
            icon={capability.icon!}
            tags={capability.tags}
            featured={index === 0}
          />
        ))}
      </div>
    </CompanySection>
  );
}