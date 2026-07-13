"use client";

import {
  Brain,
  Building2,
  GraduationCap,
  HeartPulse,
} from "lucide-react";

const initiatives = [
  {
    title: "LabReport AI",
    category: "Digital Healthcare",
    status: "Active Development",
    icon: HeartPulse,
  },
  {
    title: "EvantraHub",
    category: "Education Platform",
    status: "Active Development",
    icon: GraduationCap,
  },
  {
    title: "StoreForge",
    category: "Enterprise Commerce",
    status: "Platform Engineering",
    icon: Building2,
  },
  {
    title: "Security-by-Ethics",
    category: "AI Governance",
    status: "Research Framework",
    icon: Brain,
  },
];

export default function CurrentResearch() {
  return (
    <section className="mt-32">
      <div className="mx-auto max-w-3xl text-center">
        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-[0.2em]
            text-[hsl(var(--accent))]
          "
        >
          Current Initiatives
        </p>

        <h2
          className="
            mt-4
            text-4xl
            font-bold
            text-white
          "
        >
          Turning Research Into Real Products
        </h2>

        <p
          className="
            mt-6
            text-lg
            leading-8
            text-white/70
          "
        >
          Our engineering teams are actively developing platforms
          that transform healthcare, education, enterprise software
          and responsible artificial intelligence.
        </p>
      </div>

      <div
        className="
          mt-16
          grid
          gap-8
          lg:grid-cols-2
        "
      >
        {initiatives.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="
                rounded-[28px]
                border
                border-white/10
                bg-white/[0.04]
                p-8
                backdrop-blur-xl
                transition-all
                duration-500
                hover:border-[hsl(var(--accent))]/40
                hover:-translate-y-1
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[hsl(var(--accent))]/10
                  text-[hsl(var(--accent))]
                "
              >
                <Icon size={28} />
              </div>

              <p
                className="
                  mt-6
                  text-sm
                  uppercase
                  tracking-[0.18em]
                  text-[hsl(var(--accent))]
                "
              >
                {item.category}
              </p>

              <h3
                className="
                  mt-3
                  text-2xl
                  font-semibold
                  text-white
                "
              >
                {item.title}
              </h3>

              <span
                className="
                  mt-6
                  inline-flex
                  rounded-full
                  bg-emerald-500/15
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-emerald-400
                "
              >
                {item.status}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}