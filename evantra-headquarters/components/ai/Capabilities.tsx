"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { aiCompany } from "@/data/companies/ai";

export default function Capabilities() {
  return (
    <CompanySection
      id="capabilities"
      background="gradient"
    >
      <SectionHeading
        badge="AI Capabilities"
        title="Building Intelligent Systems That Transform Industries"
        description="From generative AI and computer vision to enterprise automation and responsible AI, we engineer intelligent technologies that solve complex real-world challenges."
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
        {aiCompany.capabilities.map((capability, index) => (
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