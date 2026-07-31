"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import InnovationCard from "@/components/shared/InnovationCard";
import VisionBanner from "@/components/shared/VisionBanner";

import { cybersecurityCompany } from "@/data/companies/cybersecurity";

export default function Research() {
  return (
    <CompanySection
      id="research"
      background="gradient"
    >
      <SectionHeading
        badge="Research"
        title="Driving the Future of Cybersecurity"
        description="Our cybersecurity research explores modern defense strategies, responsible AI security, Zero Trust architecture and resilient digital infrastructure."
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
        {cybersecurityCompany.research.map((item) => (
          <InnovationCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>

      <div className="mt-24">
        <VisionBanner
          title="Research That Strengthens Digital Trust"
          description="We invest in cybersecurity research that strengthens digital resilience, protects critical infrastructure and prepares organizations for the next generation of cyber threats."
        />
      </div>
    </CompanySection>
  );
}