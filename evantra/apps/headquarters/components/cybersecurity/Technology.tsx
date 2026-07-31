"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import TechChip from "@/components/shared/TechChip";

import { cybersecurityCompany } from "@/data/companies/cybersecurity";

export default function Technology() {
  return (
    <CompanySection
      id="technology"
      background="gradient"
    >
      <SectionHeading
        badge="Technology"
        title="Modern Cybersecurity Technologies"
        description="We leverage industry-leading security technologies, modern infrastructure and Zero Trust principles to protect digital ecosystems."
        centered
      />

      <div
        className="
          mt-20
          grid
          gap-8
          lg:grid-cols-2
          xl:grid-cols-3
        "
      >
        {cybersecurityCompany.technologies.map((category) => (
          <div
            key={category.title}
            className="
              rounded-[30px]
              border
              border-white/10
              bg-white/[0.04]
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
                  mt-4
                  text-white/70
                  leading-7
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
              {category.technologies.map((technology, index) => (
                <TechChip
                  key={`${String(technology)}-${index}`}
                  label={String(technology)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </CompanySection>
  );
}