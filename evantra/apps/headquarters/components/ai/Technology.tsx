"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import TechChip from "@/components/shared/TechChip";

import { aiCompany } from "@/data/companies/ai";

export default function Technology() {
    return (
        <CompanySection id="technology">
            <SectionHeading
                badge="Technology Stack"
                title="Powered by Modern Artificial Intelligence Technologies"
                description="We leverage state-of-the-art AI models, machine learning frameworks, cloud infrastructure and enterprise deployment platforms to build secure, scalable and production-ready intelligent systems."
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
                {aiCompany.technologies.map((category) => (
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
                            {category.technologies.map((technology, index) => {
                                const label =
                                    typeof technology === "string"
                                        ? technology
                                        : "label" in technology
                                        ? (technology as any).label
                                        : String(technology);

                                return (
                                    <TechChip
                                        key={`${label}-${index}`}
                                        label={label}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </CompanySection>
    );
}