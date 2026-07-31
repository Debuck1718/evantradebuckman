"use client";

import {
  Brain,
  Globe2,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import CompanySection from "@/components/shared/CompanySection";
import FeatureCard from "@/components/shared/FeatureCard";
import SectionHeading from "@/components/shared/SectionHeading";
import VisionBanner from "@/components/shared/VisionBanner";

const principles = [
  {
    title: "Engineering Excellence",

    description:
      "We build secure, scalable and maintainable software with precision, craftsmanship and long-term thinking.",

    icon: Sparkles,

    tags: [
      "Quality",
      "Architecture",
      "Performance",
    ],
  },

  {
    title: "Innovation Without Limits",

    description:
      "We challenge assumptions, explore emerging technologies and create solutions that redefine industries.",

    icon: Lightbulb,

    tags: [
      "Innovation",
      "Research",
      "Creativity",
    ],
  },

  {
    title: "Security by Design",

    description:
      "Security is integrated into every stage of engineering through modern practices, Zero Trust principles and responsible software development.",

    icon: ShieldCheck,

    tags: [
      "Security",
      "Privacy",
      "Trust",
    ],
  },

  {
    title: "People-Centered Technology",

    description:
      "Every product we build is designed to solve meaningful problems, improve lives and strengthen organizations.",

    icon: Users,

    tags: [
      "Impact",
      "Accessibility",
      "Human-Centered",
    ],
  },

  {
    title: "Continuous Learning",

    description:
      "We believe the best engineers never stop learning. Curiosity, experimentation and knowledge sharing drive our culture.",

    icon: Brain,

    tags: [
      "Learning",
      "Growth",
      "Mentorship",
    ],
  },

  {
    title: "Global Impact",

    description:
      "Our ambition is to engineer technology that creates opportunities across Africa and contributes to the global digital economy.",

    icon: Globe2,

    tags: [
      "Africa",
      "Global",
      "Technology",
    ],
  },
];

export default function Culture() {
  return (
    <CompanySection id="culture">
      <SectionHeading
        badge="Engineering Culture"
        title="A Culture Built Around Innovation and Excellence"
        description="We believe exceptional software is created by exceptional teams. Our engineering culture is founded on curiosity, responsibility, continuous learning and a commitment to building technology that creates meaningful impact."
        centered
      />

      <div
        className="
          mt-20
          grid
          gap-8
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {principles.map((principle) => (
          <FeatureCard
            key={principle.title}
            title={principle.title}
            description={principle.description}
            icon={principle.icon}
            tags={principle.tags}
          />
        ))}
      </div>

      {/* Engineering Philosophy */}

      <div
        className="
          mx-auto
          mt-24
          max-w-5xl
          rounded-[36px]
          border
          border-white/10
          bg-white/[0.04]
          p-10
          text-center
          backdrop-blur-xl
        "
      >
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

        <h3
          className="
            mt-6
            text-4xl
            font-bold
            text-white
          "
        >
          Technology Should Serve People
        </h3>

        <p
          className="
            mx-auto
            mt-8
            max-w-3xl
            text-lg
            leading-9
            text-white/70
          "
        >
          At Evantra, technology is never built simply because it can be.
          Every platform begins with a purpose: solving meaningful problems,
          empowering people and creating lasting value. We combine engineering
          excellence, responsible innovation, security and human-centered design
          to create digital solutions that organizations can trust and communities
          can benefit from.
        </p>

        <div
          className="
            mt-12
            flex
            flex-wrap
            justify-center
            gap-4
          "
        >
          {[
            "Secure",
            "Scalable",
            "Intelligent",
            "Human-Centered",
          ].map((item) => (
            <span
              key={item}
              className="
                rounded-full
                border
                border-[hsl(var(--accent))]/20
                bg-[hsl(var(--accent))]/10
                px-5
                py-2
                text-sm
                font-semibold
                text-[hsl(var(--accent))]
              "
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <VisionBanner
          title="Engineering Technology That Serves People"
          description="Every innovation we pursue is guided by our commitment to building secure, intelligent and scalable technologies that improve lives, strengthen organizations and accelerate sustainable digital transformation."
        />
      </div>
    </CompanySection>
  );
}