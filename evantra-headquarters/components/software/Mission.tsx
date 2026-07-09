"use client";

import {
  Cpu,
  Layers,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import CompanySection from "@/components/shared/CompanySection";
import FeatureCard from "@/components/shared/FeatureCard";
import SectionHeading from "@/components/shared/SectionHeading";

const values = [
  {
    title: "Innovation",

    description:
      "We embrace emerging technologies to create software that shapes industries and transforms organizations.",

    icon: Rocket,
  },

  {
    title: "Security",

    description:
      "Security is embedded into every stage of engineering through Zero Trust principles and secure development.",

    icon: ShieldCheck,
  },

  {
    title: "Scalability",

    description:
      "Our cloud-native platforms are designed to evolve with organizations of every size.",

    icon: Layers,
  },

  {
    title: "Engineering Excellence",

    description:
      "We combine modern architecture, automation and disciplined engineering practices to deliver world-class software.",

    icon: Cpu,
  },
];

export default function Mission() {
  return (
    <CompanySection id="mission">
      <SectionHeading
        badge="Our Mission"
        title="Engineering Digital Excellence"
        description="The Evantra Software Center exists to engineer secure, intelligent and scalable digital platforms that empower governments, enterprises and communities. We transform complex challenges into innovative software solutions that create lasting impact across Africa and the global digital economy."
        centered
      />

      <div
        className="
          mt-20

          grid

          gap-8

          md:grid-cols-2

          xl:grid-cols-4
        "
      >
        {values.map((value) => (
          <FeatureCard
            key={value.title}
            title={value.title}
            description={value.description}
            icon={value.icon}
          />
        ))}
      </div>
    </CompanySection>
  );
}