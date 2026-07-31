"use client";

import CompanySection from "@/components/shared/CompanySection";
import FeatureCard from "@/components/shared/FeatureCard";
import SectionHeading from "@/components/shared/SectionHeading";

import { cybersecurityCompany } from "@/data/companies/cybersecurity";

export default function Capabilities() {
  return (
    <CompanySection
      id="capabilities"
      background="gradient"
    >
      <SectionHeading
        badge="Capabilities"
        title="Comprehensive Cybersecurity Engineering"
        description="Our multidisciplinary security teams protect organizations through secure software engineering, intelligent threat detection, identity protection and resilient cloud security."
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
        {cybersecurityCompany.capabilities.map((capability, index) => (
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