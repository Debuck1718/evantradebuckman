"use client";

import Reveal from "@/components/shared/Reveal";
import SectionBadge from "@/components/shared/SectionBadge";

export default function GlobalImpactHeader() {
  return (
    <div className="mx-auto mb-24 max-w-4xl text-center">
      <Reveal>
        <div className="flex justify-center">
          <SectionBadge>
            GLOBAL IMPACT
          </SectionBadge>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2
          className="
            mt-8
            text-5xl
            font-bold
            tracking-tight
            text-slate-900
            md:text-6xl
          "
        >
          Engineering a Better
          <br />
          <span className="text-ev-gold-gradient">
            Future Together
          </span>
        </h2>
      </Reveal>

      <Reveal delay={0.16}>
        <p
          className="
            mx-auto
            mt-8
            max-w-3xl
            text-xl
            leading-9
            text-slate-600
          "
        >
          Evantra believes technology should create opportunities,
          strengthen communities and contribute to sustainable
          economic development through innovation, collaboration
          and responsible engineering.
        </p>
      </Reveal>
    </div>
  );
}