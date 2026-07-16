"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import VisionBanner from "@/components/shared/VisionBanner";

import { engineeringCompany } from "@/data/companies/engineering";

export default function Mission() {
  return (
    <CompanySection id="mission">
      <SectionHeading
        badge="Our Mission"
        title={engineeringCompany.mission.title}
        description={engineeringCompany.mission.description}
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
              Engineering Philosophy
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
              Engineering Should Solve
              <br />
              Real-World Challenges.
            </h2>

            <p
              className="
                mt-8
                text-lg
                leading-9
                text-white/70
              "
            >
              We believe engineering is most valuable when it improves lives,
              strengthens industries and creates intelligent infrastructure that
              addresses meaningful real-world problems through practical
              innovation.
            </p>

            <p
              className="
                mt-6
                text-lg
                leading-9
                text-white/70
              "
            >
              Every engineering solution developed by Evantra is designed around
              precision, safety, sustainability and long-term impact—from
              autonomous systems and robotics to industrial IoT and intelligent
              infrastructure.
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
                value: "Precision",
                label: "Engineered for Accuracy",
              },
              {
                value: "Reliable",
                label: "Built for Mission-Critical Systems",
              },
              {
                value: "Intelligent",
                label: "AI-Driven Engineering Solutions",
              },
              {
                value: "Sustainable",
                label: "Designed for Long-Term Impact",
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
          title="Engineering the Infrastructure of Tomorrow"
          description="Our vision is to develop intelligent engineering technologies that transform industries through autonomous systems, robotics, industrial IoT and smart infrastructure while advancing safety, sustainability and engineering excellence."
        />
      </div>
    </CompanySection>
  );
}