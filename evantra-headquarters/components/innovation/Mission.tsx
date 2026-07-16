"use client";

import CompanySection from "@/components/shared/CompanySection";
import SectionHeading from "@/components/shared/SectionHeading";
import VisionBanner from "@/components/shared/VisionBanner";

import { innovationCompany } from "@/data/companies/innovation";

export default function Mission() {
  return (
    <CompanySection id="mission">
      <SectionHeading
        badge="Our Mission"
        title={innovationCompany.mission.title}
        description={innovationCompany.mission.description}
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
              Innovation Philosophy
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
              Innovation Begins
              <br />
              With Bold Ideas.
            </h2>

            <p
              className="
                mt-8
                text-lg
                leading-9
                text-white/70
              "
            >
              We believe every transformative technology starts with curiosity,
              experimentation and a willingness to challenge conventional
              thinking. Innovation is the bridge between imagination and
              meaningful impact.
            </p>

            <p
              className="
                mt-6
                text-lg
                leading-9
                text-white/70
              "
            >
              Every initiative at Evantra's Innovation Center is guided by
              research, rapid validation and multidisciplinary collaboration,
              ensuring that bold ideas become practical technologies capable of
              improving industries and communities.
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
                value: "Discover",
                label: "Explore Emerging Opportunities",
              },
              {
                value: "Prototype",
                label: "Transform Ideas into Reality",
              },
              {
                value: "Validate",
                label: "Test Through Research",
              },
              {
                value: "Scale",
                label: "Create Global Impact",
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
          title="Creating the Technologies of Tomorrow"
          description="Our vision is to transform breakthrough ideas into practical innovations that empower industries, strengthen communities and inspire the next generation of technological advancement through research, collaboration and entrepreneurship."
        />
      </div>
    </CompanySection>
  );
}