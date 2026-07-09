"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import TechChip from "@/components/shared/TechChip";

import { softwareCompany } from "@/data/companies";

export default function Technology() {
  return (
    <CompanySection id="technology">
      <SectionHeading
        badge="Technology"
        title="Engineering With Modern Technologies"
        description="Our engineering teams combine modern frameworks, cloud-native infrastructure, artificial intelligence and secure development practices to deliver world-class digital solutions."
        centered
      />

      <div className="mt-20 space-y-12">
        {softwareCompany.technologies.map((group) => (
          <div key={group.title}>
            <h3
              className="
                mb-5

                text-xl

                font-semibold

                text-white
              "
            >
              {group.title}
            </h3>

            <div
              className="
                flex

                flex-wrap

                gap-4
              "
            >
              {group.technologies.map((tech) => (
                <TechChip
                  key={tech}
                  label={tech}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </CompanySection>
  );
}