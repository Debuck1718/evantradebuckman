"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import VisionBanner from "@/components/shared/VisionBanner";

import { commerceCompany } from "@/data/companies/commerce";

export default function Mission() {
  return (
    <CompanySection id="mission">
      <SectionHeading
        badge="Our Mission"
        title={commerceCompany.mission.title}
        description={commerceCompany.mission.description}
        centered
      />

      {/* Philosophy */}

      <div
        className="
          mx-auto
          mt-20
          max-w-6xl
          rounded-[36px]
          border
          border-white/10
          bg-white/[0.04]
          p-10
          backdrop-blur-xl
        "
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left */}

          <div>
            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[hsl(var(--accent))]
              "
            >
              Commerce Philosophy
            </p>

            <h2
              className="
                mt-6
                text-4xl
                font-bold
                leading-tight
                text-white
              "
            >
              Commerce Should Empower Businesses,
              <br />
              Not Create Barriers.
            </h2>

            <p
              className="
                mt-8
                text-lg
                leading-9
                text-white/70
              "
            >
              We believe every entrepreneur, startup and enterprise deserves
              access to world-class commerce infrastructure that enables growth,
              innovation and long-term success.
            </p>

            <p
              className="
                mt-6
                text-lg
                leading-9
                text-white/70
              "
            >
              Every commerce platform engineered by Evantra is designed around
              scalability, security, intelligent automation and exceptional user
              experiences that help businesses compete confidently in the global
              digital economy.
            </p>
          </div>

          {/* Right */}

          <div
            className="
              grid
              gap-6
              sm:grid-cols-2
            "
          >
            {[
              {
                value: "Scalable",
                label: "Built for Business Growth",
              },
              {
                value: "Secure",
                label: "Payments & Data Protected",
              },
              {
                value: "Intelligent",
                label: "AI-Powered Commerce",
              },
              {
                value: "Global",
                label: "Ready for International Markets",
              },
            ].map((item) => (
              <div
                key={item.value}
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#081521]/70
                  p-6
                "
              >
                <h3
                  className="
                    text-2xl
                    font-bold
                    text-[hsl(var(--accent))]
                  "
                >
                  {item.value}
                </h3>

                <p
                  className="
                    mt-3
                    text-white/70
                  "
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision */}

      <div className="mt-24">
        <VisionBanner
          title="Engineering the Future of Global Digital Commerce"
          description="Our vision is to build secure, intelligent and scalable commerce platforms that empower entrepreneurs, retailers and enterprises to participate confidently in the global digital economy through innovative technology, trusted infrastructure and exceptional customer experiences."
        />
      </div>
    </CompanySection>
  );
}