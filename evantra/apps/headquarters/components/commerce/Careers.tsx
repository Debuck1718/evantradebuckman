"use client";

import CompanySection from "@/components/shared/CompanySection";
import VisionBanner from "@/components/shared/VisionBanner";

import { commerceCompany } from "@/data/companies/commerce";

export default function Careers() {
  return (
    <CompanySection
      id="careers"
      background="gradient"
    >
      <VisionBanner
        title={commerceCompany.careers.title}
        description={commerceCompany.careers.description}
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
            title: "Build Commerce That Scales",

            description:
              "Engineer enterprise-grade commerce platforms that empower startups, retailers and global organizations to grow confidently in the digital economy.",
          },

          {
            title: "Innovate With Modern Technology",

            description:
              "Work with cloud-native architecture, AI-powered commerce, secure payment infrastructure and scalable enterprise platforms.",
          },

          {
            title: "Continuous Professional Growth",

            description:
              "Advance your career through mentorship, certifications, product innovation, research initiatives and continuous technical learning.",
          },

          {
            title: "Shape Global Digital Commerce",

            description:
              "Help build technology that strengthens digital commerce ecosystems across Africa and the global marketplace through innovation and collaboration.",
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