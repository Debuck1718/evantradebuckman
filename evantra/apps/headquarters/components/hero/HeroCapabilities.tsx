"use client";

import {
  BrainCircuit,
  ShieldCheck,
  Cpu,
  FlaskConical,
} from "lucide-react";

import Reveal from "@/components/shared/Reveal";

const capabilities = [
  {
    icon: BrainCircuit,
    title: "SOFTWARE & AI",
    line1: "Enterprise Systems.",
    line2: "Global Scale Execution.",
  },
  {
    icon: ShieldCheck,
    title: "CYBERSECURITY",
    line1: "Sovereign Defense.",
    line2: "Zero-Knowledge Cloud.",
  },
  {
    icon: Cpu,
    title: "ENGINEERING",
    line1: "Mission-Critical Systems.",
    line2: "Institutional Precision.",
  },
  {
    icon: FlaskConical,
    title: "ENTERPRISE & VENTURES",
    line1: "Global Collaborations.",
    line2: "Strategic Scalability.",
  },
];

export default function HeroCapabilities() {
  return (
    <Reveal delay={0.6}>
      <div
        className="
          mt-20

          grid
          grid-cols-2

          gap-y-10

          border-t
          border-white/10

          pt-10

          md:grid-cols-4
        "
      >
        {capabilities.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`
                group
                relative
                px-2

                transition-all
                duration-300

                hover:-translate-y-1

                ${
                  index !== capabilities.length - 1
                    ? "md:border-r md:border-white/10"
                    : ""
                }
              `}
            >
              {/* Icon */}

              <Icon
                className="
                  mb-5

                  h-11
                  w-11

                  text-[hsl(var(--accent))]

                  transition-all
                  duration-300

                  group-hover:scale-105
                "
              />

              {/* Title */}

              <h3
                className="
                  text-[15px]
                  font-semibold

                  uppercase

                  tracking-[0.12em]

                  text-white
                "
              >
                {item.title}
              </h3>

              {/* Description */}

              <div
                className="
                  mt-5

                  space-y-1

                  text-[15px]
                  leading-7

                  text-white/65
                "
              >
                <p>{item.line1}</p>
                <p>{item.line2}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}