"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import VisionBanner from "@/components/shared/VisionBanner";

import { cybersecurityCompany } from "@/data/companies/cybersecurity";

export default function Mission() {
  return (
    <CompanySection
      id="mission"
      background="light"
    >
      <SectionHeading
        badge="Our Mission"
        title={cybersecurityCompany.mission.title}
        description={cybersecurityCompany.mission.description}
        centered
      />

      <div className="mt-24">
        <VisionBanner
          title="Security Built Into Every Layer"
          description="Cybersecurity is most effective when it is engineered into software, infrastructure and artificial intelligence from the very beginning. We design resilient digital ecosystems that enable innovation without compromising trust, privacy or resilience."
        />
      </div>
    </CompanySection>
  );
}