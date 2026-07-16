"use client";

import CompanySection from "@/components/shared/CompanySection";
import VisionBanner from "@/components/shared/VisionBanner";

import { engineeringCompany } from "@/data/companies/engineering";

export default function Careers() {
  return (
    <CompanySection
      id="careers"
      background="gradient"
    >
      <VisionBanner
        title={engineeringCompany.careers.title}
        description={engineeringCompany.careers.description}
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
            title: "Engineer the Future",

            description:
              "Design autonomous systems, robotics, industrial IoT platforms and intelligent infrastructure that solve meaningful engineering challenges.",
          },

          {
            title: "Work Across Disciplines",

            description:
              "Collaborate with software engineers, robotics specialists, electronics engineers and AI researchers to build integrated engineering solutions.",
          },

          {
            title: "Continuous Technical Growth",

            description:
              "Advance your engineering career through research, prototyping, certifications, technical mentorship and hands-on innovation.",
          },

          {
            title: "Create Lasting Impact",

            description:
              "Help shape the future of engineering by building technologies that improve industries, strengthen infrastructure and enhance communities worldwide.",
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
              transition-all
              duration-300
              hover:border-[hsl(var(--accent))]/30
              hover:-translate-y-1
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