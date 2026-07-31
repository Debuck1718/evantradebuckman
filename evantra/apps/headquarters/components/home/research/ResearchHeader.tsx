"use client";

import Reveal from "@/components/shared/Reveal";
import SectionBadge from "@/components/shared/SectionBadge";

export default function ResearchHeader() {
  return (
    <div
      className="
        mx-auto
        mb-24
        max-w-4xl
        text-center
      "
    >
      <Reveal>
        <div className="flex justify-center">
          <SectionBadge>
            RESEARCH & INNOVATION
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
            text-white
            md:text-6xl
          "
        >
          Research That Shapes
          <br />

          <span className="text-ev-gold-gradient">
            Tomorrow
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
            text-white/75
          "
        >
          Evantra continuously invests in research that
          transforms emerging technologies into practical
          engineering solutions with measurable impact.
        </p>
      </Reveal>
    </div>
  );
}