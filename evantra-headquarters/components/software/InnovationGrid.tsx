"use client";

import {
  Brain,
  Building2,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import InnovationCard from "@/components/shared/InnovationCard";

const pillars = [
  {
    title: "Artificial Intelligence",

    description:
      "Developing practical AI systems that improve healthcare, education, enterprise software and digital decision-making.",

    icon: Brain,

    tags: [
      "LLMs",
      "Machine Learning",
      "Automation",
    ],
  },

  {
    title: "Digital Healthcare",

    description:
      "Engineering intelligent healthcare platforms that improve patient care, diagnostics and medical collaboration.",

    icon: HeartPulse,

    tags: [
      "Telemedicine",
      "AI",
      "Hospitals",
    ],
  },

  {
    title: "Education Technology",

    description:
      "Creating modern academic ecosystems that enhance learning, collaboration and institutional excellence.",

    icon: GraduationCap,

    tags: [
      "Learning",
      "Collaboration",
      "Digital Campus",
    ],
  },

  {
    title: "Enterprise Platforms",

    description:
      "Designing scalable cloud-native enterprise software that powers organizations across industries.",

    icon: Building2,

    tags: [
      "Cloud",
      "Enterprise",
      "SaaS",
    ],
  },

  {
    title: "Cybersecurity",

    description:
      "Embedding security, privacy and trust into every digital platform through modern engineering practices.",

    icon: ShieldCheck,

    tags: [
      "Zero Trust",
      "Security",
      "Compliance",
    ],
  },

  {
    title: "Emerging Technologies",

    description:
      "Exploring IoT, robotics, cloud computing and future digital infrastructure that will shape tomorrow's world.",

    icon: Sparkles,

    tags: [
      "IoT",
      "Cloud",
      "Innovation",
    ],
  },
];

export default function InnovationGrid() {
  return (
    <section className="mt-20">
      <div
        className="
          grid
          gap-8
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {pillars.map((pillar) => (
          <InnovationCard
            key={pillar.title}
            title={pillar.title}
            description={pillar.description}
            icon={pillar.icon}
            tags={pillar.tags}
          />
        ))}
      </div>
    </section>
  );
}