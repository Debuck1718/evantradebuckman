"use client";

import CompanySection from "@/components/shared/CompanySection";
import VisionBanner from "@/components/shared/VisionBanner";

import { innovationCompany } from "@/data/companies/innovation";

export default function Careers() {
  return (
    <CompanySection
      id="careers"
      background="gradient"
    >
      <VisionBanner
        title={innovationCompany.careers.title}
        description={innovationCompany.careers.description}
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
            title: "Think Beyond Today",

            description:
              "Explore emerging technologies and transform ambitious ideas into breakthrough innovations with global potential.",
          },

          {
            title: "Prototype the Future",

            description:
              "Collaborate across research, engineering and design to rapidly build, validate and refine next-generation technologies.",
          },

          {
            title: "Innovate Without Limits",

            description:
              "Work in an environment that encourages experimentation, continuous learning and bold thinking to solve tomorrow's challenges.",
          },

          {
            title: "Create Lasting Impact",

            description:
              "Help build technologies, ventures and solutions that improve industries, strengthen communities and shape the future.",
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