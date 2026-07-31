"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import TechChip from "@/components/shared/TechChip";

import { engineeringCompany } from "@/data/companies/engineering";

export default function Technology() {
  return (
    <CompanySection id="technology">
      <SectionHeading
        badge="Technology Stack"
        title="Powered by Modern Engineering Technologies"
        description="We leverage advanced robotics frameworks, embedded systems, industrial IoT, edge computing and artificial intelligence technologies to engineer reliable, scalable and production-ready engineering solutions."
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
        {engineeringCompany.technologies.map((category) => (
          <div
            key={category.title}
            className="
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.04]
              p-8
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-[hsl(var(--accent))]/30
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

            {category.description && (
              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-white/60
                "
              >
                {category.description}
              </p>
            )}

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