"use client";

import CompanySection from "@/components/shared/CompanySection";
import VisionBanner from "@/components/shared/VisionBanner";

import { aiCompany } from "@/data/companies/ai";

export default function Careers() {
  return (
    <CompanySection
      id="careers"
      background="gradient"
    >
      <VisionBanner
        title={aiCompany.careers.title}
        description={aiCompany.careers.description}
      />

      <div
        className="
          mx-auto
          mt-20
          grid
          max-w-7xl
          gap-8
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {[
          {
            title: "Solve Meaningful Problems",

            description:
              "Build AI solutions that improve healthcare, education, enterprise and public services while creating measurable impact.",
          },

          {
            title: "Research Without Limits",

            description:
              "Work alongside engineers and researchers exploring cutting-edge artificial intelligence and emerging technologies.",
          },

          {
            title: "Continuous Growth",

            description:
              "Develop professionally through mentorship, certifications, conferences, research initiatives and lifelong learning.",
          },

          {
            title: "Global Vision",

            description:
              "Help position Africa as a global contributor to trustworthy artificial intelligence through innovation and collaboration.",
          },
        ].map((item) => (
          <div
            key={item.title}
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
              {item.title}
            </h3>

            <p
              className="
                mt-5
                leading-8
                text-white/70
              "
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </CompanySection>
  );
}