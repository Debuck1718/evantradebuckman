"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import TechChip from "@/components/shared/TechChip";

import { innovationCompany } from "@/data/companies/innovation";

export default function Technology() {
  return (
    <CompanySection id="technology">
      <SectionHeading
        badge="Technology Stack"
        title="Powered by Emerging Technologies"
        description="We combine frontier research, intelligent systems and modern engineering technologies to prototype, validate and commercialize the innovations that will shape tomorrow."
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
        {innovationCompany.technologies.map((category) => (
          <div
            key={category.name}
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
                  mt-4
                  leading-7
                  text-white/70
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
              {category.technologies.map((technology) => (
                <TechChip
                  key={technology.title}
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