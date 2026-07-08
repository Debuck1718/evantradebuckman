"use client";

import Reveal from "@/components/shared/Reveal";
import SectionBadge from "@/components/shared/SectionBadge";

export default function EcosystemHeader() {
  return (
    <div
      className="
        mx-auto
        mb-20
        max-w-4xl
        text-center
      "
    >
      <Reveal>
        <div className="flex justify-center">
          <SectionBadge>
            BUSINESS ECOSYSTEM
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
          Engineering the Future
          <br />

          <span className="text-ev-gold-gradient">
            Across Industries
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
          Evantra builds technologies, companies and
          intelligent systems that transform industries,
          strengthen economies and improve lives through
          engineering excellence, research and innovation.
        </p>
      </Reveal>
    </div>
  );
}