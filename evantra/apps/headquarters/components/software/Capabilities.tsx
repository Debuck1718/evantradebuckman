"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import FeatureCard from "@/components/shared/FeatureCard";

import { softwareCompany } from "@/data/companies/software";

export default function Capabilities() {
  return (
    <CompanySection
      id="capabilities"
      background="gradient"
    >
      <SectionHeading
        badge="Capabilities"
        title="Engineering the Digital Infrastructure of Tomorrow"
        description="From enterprise platforms to artificial intelligence, our multidisciplinary engineering teams build secure, scalable and future-ready software ecosystems."
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
        {softwareCompany.capabilities.map(
          (capability, index) => (
            <FeatureCard
              key={capability.title}
              title={capability.title}
              description={capability.description}
              icon={capability.icon!}
              tags={capability.tags}
              featured={index === 0}
            />
          )
        )}
      </div>
    </CompanySection>
  );
}