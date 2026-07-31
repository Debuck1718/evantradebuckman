"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import VisionBanner from "@/components/shared/VisionBanner";

import { aiCompany } from "@/data/companies/ai";

export default function Mission() {
  return (
    <CompanySection id="mission">
      <SectionHeading
        badge="Our Mission"
        title={aiCompany.mission.title}
        description={aiCompany.mission.description}
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
              Artificial Intelligence Philosophy
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
              Intelligence Should Empower Humanity,
              <br />
              Not Replace It.
            </h2>

            <p
              className="
                mt-8
                text-lg
                leading-9
                text-white/70
              "
            >
              We believe artificial intelligence should amplify human
              creativity, improve decision-making and solve meaningful
              problems—not replace human judgment.
            </p>

            <p
              className="
                mt-6
                text-lg
                leading-9
                text-white/70
              "
            >
              Every AI system engineered by Evantra is designed around
              transparency, security, fairness and measurable real-world
              impact.
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
                value: "Human-Centered",
                label: "AI Designed Around People",
              },
              {
                value: "Explainable",
                label: "Transparent Decision Making",
              },
              {
                value: "Responsible",
                label: "Ethics Embedded by Design",
              },
              {
                value: "Secure",
                label: "Privacy & Trust First",
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
          title="Building Artificial Intelligence People Can Trust"
          description="Our vision is to develop secure, explainable and human-centered AI technologies that transform industries, strengthen organizations and improve lives while maintaining the highest standards of ethics and engineering excellence."
        />
      </div>
    </CompanySection>
  );
}