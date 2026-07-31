"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { commerceCompany } from "@/data/companies/commerce";

export default function Capabilities() {
  return (
    <CompanySection
      id="capabilities"
      background="gradient"
    >
      <SectionHeading
        badge="Commerce Capabilities"
        title="Building Commerce Infrastructure That Powers Modern Business"
        description="From enterprise commerce platforms and intelligent inventory systems to secure payment infrastructure and AI-powered business intelligence, we engineer scalable technologies that enable organizations to grow in the digital economy."
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
        {commerceCompany.capabilities.map((capability, index) => (
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