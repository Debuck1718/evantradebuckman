"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import TechChip from "@/components/shared/TechChip";

import { softwareCompany } from "@/data/companies";

export default function Technology() {
  return (
    <CompanySection
      id="technology"
      background="gradient"
    >
      <SectionHeading
        badge="Technology Stack"
        title="Engineering With Modern Technologies"
        description="Our engineering teams leverage proven technologies, cloud-native infrastructure and artificial intelligence to build secure, scalable and future-ready digital platforms."
        centered
      />

      <div className="mt-20 space-y-14">
        {softwareCompany.technologies.map((category) => (
          <div
            key={category.title}
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-8
              backdrop-blur-xl
            "
          >
            <h3
              className="
                text-2xl
                font-semibold
                text-white
              "
            >
              {category.title}
            </h3>

            {category.description && (
              <p
                className="
                  mt-3
                  max-w-3xl
                  text-white/70
                "
              >
                {category.description}
              </p>
            )}

            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-3
              "
            >
              {category.technologies.map((technology) => (
                <TechChip
                  key={technology.name}
                  label={technology.name}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </CompanySection>
  );
}