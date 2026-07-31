"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import InnovationCard from "@/components/shared/InnovationCard";
import VisionBanner from "@/components/shared/VisionBanner";

import { innovationCompany } from "@/data/companies/innovation";

export default function Research() {
  return (
    <CompanySection
      id="research"
      background="gradient"
    >
      <SectionHeading
        badge="Research & Innovation"
        title="Exploring Technologies That Shape the Future"
        description="The Evantra Innovation Center transforms emerging ideas into practical technologies through multidisciplinary research, rapid experimentation and product commercialization."
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
        {innovationCompany.research.map((item) => (
          <InnovationCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            tags={item.tags ?? []}
          />
        ))}
      </div>

      <div className="mt-24">
        <VisionBanner
          title="Innovation That Creates Tomorrow"
          description="Every initiative within the Evantra Innovation Center begins with curiosity, advances through rigorous research and evolves into technologies capable of transforming industries, empowering communities and improving lives."
        />
      </div>
    </CompanySection>
  );
}