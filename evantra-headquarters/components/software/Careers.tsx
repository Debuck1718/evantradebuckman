"use client";

import {
  ArrowRight,
  Brain,
  Code2,
  Globe2,
  Rocket,
} from "lucide-react";

import CompanySection from "@/components/shared/CompanySection";
import FeatureCard from "@/components/shared/FeatureCard";
import SectionHeading from "@/components/shared/SectionHeading";
import VisionBanner from "@/components/shared/VisionBanner";
import { EvantraButton } from "@/components/shared/EvantraButton";

const reasons = [
  {
    title: "Build Products That Matter",

    description:
      "Contribute to platforms that improve healthcare, education, commerce and enterprise technology while creating meaningful impact for people and organizations.",

    icon: Rocket,

    tags: [
      "Real Products",
      "Meaningful Impact",
    ],
  },

  {
    title: "Modern Engineering",

    description:
      "Work with modern software engineering practices, cloud-native architecture, artificial intelligence, cybersecurity and scalable digital platforms.",

    icon: Code2,

    tags: [
      "Cloud",
      "AI",
      "Enterprise",
    ],
  },

  {
    title: "Continuous Growth",

    description:
      "Grow alongside engineers who value curiosity, research, collaboration and continuous learning in everything they build.",

    icon: Brain,

    tags: [
      "Learning",
      "Innovation",
      "Mentorship",
    ],
  },

  {
    title: "Global Mission",

    description:
      "Help engineer technology that creates opportunities across Africa while contributing solutions to the global digital economy.",

    icon: Globe2,

    tags: [
      "Africa",
      "Global",
      "Purpose",
    ],
  },
];

const opportunities = [
  "Software Engineering",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Engineering",
  "Research & Innovation",
  "Product Design",
];

export default function Careers() {
  return (
    <CompanySection id="careers">
      <SectionHeading
        badge="Careers"
        title="Build the Future With Evantra"
        description="We're building a multidisciplinary engineering organization focused on creating intelligent platforms that solve meaningful challenges. While we're not actively hiring today, we're preparing opportunities for exceptional talent who share our vision."
        centered
      />

      {/* Why Evantra */}

      <div
        className="
          mt-20
          grid
          gap-8
          md:grid-cols-2
        "
      >
        {reasons.map((reason) => (
          <FeatureCard
            key={reason.title}
            title={reason.title}
            description={reason.description}
            icon={reason.icon}
            tags={reason.tags}
          />
        ))}
      </div>

      {/* Future Opportunities */}

      <div
        className="
          mt-24
          rounded-[36px]
          border
          border-white/10
          bg-white/[0.04]
          p-10
          backdrop-blur-xl
        "
      >
        <div className="text-center">
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[hsl(var(--accent))]
            "
          >
            Future Opportunities
          </p>

          <h3
            className="
              mt-4
              text-4xl
              font-bold
              text-white
            "
          >
            Opportunities Opening Soon
          </h3>

          <p
            className="
              mx-auto
              mt-6
              max-w-3xl
              text-lg
              leading-9
              text-white/70
            "
          >
            As Evantra grows, we'll open opportunities across engineering,
            artificial intelligence, cybersecurity, research and product
            development. We're committed to building a diverse team of
            innovators dedicated to engineering technology that serves people.
          </p>
        </div>

        <div
          className="
            mt-12
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {opportunities.map((role) => (
            <div
              key={role}
              className="
                rounded-2xl
                border
                border-white/10
                bg-[#081521]/60
                p-5
              "
            >
              <h4
                className="
                  text-lg
                  font-semibold
                  text-white
                "
              >
                {role}
              </h4>

              <span
                className="
                  mt-3
                  inline-flex
                  rounded-full
                  bg-[hsl(var(--accent))]/10
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[hsl(var(--accent))]
                "
              >
                Coming Soon
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}

        <div
          className="
            mt-14
            flex
            justify-center
          "
        >
          <EvantraButton
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            disabled
          >
            Careers Portal Coming Soon
          </EvantraButton>
        </div>
      </div>

      {/* Closing Vision */}

      <div className="mt-24">
        <VisionBanner
          title="Join the Engineers Building Tomorrow"
          description="Our future will be shaped by curious minds, bold ideas and responsible innovation. We look forward to welcoming talented people who share our passion for building secure, intelligent and human-centered technology."
        />
      </div>
    </CompanySection>
  );
}