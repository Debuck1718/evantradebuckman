"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import InnovationCard from "@/components/shared/InnovationCard";
import VisionBanner from "@/components/shared/VisionBanner";

import { commerceCompany } from "@/data/companies/commerce";

export default function Research() {
  return (
    <CompanySection
      id="research"
      background="gradient"
    >
      <SectionHeading
        badge="Research & Innovation"
        title="Advancing Digital Commerce Through Innovation"
        description="The Evantra Commerce Center transforms research into practical commerce technologies by developing intelligent platforms, secure payment infrastructure, business intelligence and next-generation digital commerce ecosystems."
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
        {commerceCompany.research.map((item) => (
          <InnovationCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            tags={(Array.isArray(item.tags)
              ? item.tags
              : []) as string[]}
          />
        ))}
      </div>

      <div className="mt-24">
        <VisionBanner
          title="Research That Powers the Future of Commerce"
          description="Every research initiative at the Evantra Commerce Center is focused on creating secure, intelligent and scalable commerce technologies that empower businesses, strengthen digital economies and enable global commercial growth."
        />
      </div>
    </CompanySection>
  );
}