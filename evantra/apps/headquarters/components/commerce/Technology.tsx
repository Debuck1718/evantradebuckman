"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import TechChip from "@/components/shared/TechChip";

import { commerceCompany } from "@/data/companies/commerce";

export default function Technology() {
  return (
    <CompanySection id="technology">
      <SectionHeading
        badge="Technology Stack"
        title="Built on Modern Commerce Infrastructure"
        description="We leverage modern web technologies, cloud infrastructure, secure payment ecosystems, enterprise databases and AI-powered services to engineer scalable commerce platforms for businesses of every size."
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
        {commerceCompany.technologies.map((category) => (
          <div
            key={category.title}
            className="
              rounded-[32px]
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
                font-bold
                text-white
              "
            >
              {category.title}
            </h3>

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-3
              "
            >
              {category.technologies.map((technology, index) => (
                <TechChip
                  key={`${technology.title}-${index}`}
                  label={technology.title}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </CompanySection>
  );
}