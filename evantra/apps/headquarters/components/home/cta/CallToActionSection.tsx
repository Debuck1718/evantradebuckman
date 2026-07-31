"use client";

import SectionContainer from "@/components/shared/SectionContainer";
import Reveal from "@/components/shared/Reveal";
import SectionBadge from "@/components/shared/SectionBadge";

import CallToActionActions from "./CallToActionActions";
import CallToActionStats from "./CallToActionStats";

export default function CallToActionSection() {
  return (
    <SectionContainer
      id="cta"
      className="
        relative
        overflow-hidden

        bg-[#06131F]
      "
    >
      {/* Gold Glow */}

      <div
        className="
          pointer-events-none

          absolute

          left-1/2
          top-0

          h-[900px]
          w-[900px]

          -translate-x-1/2

          rounded-full

          bg-[radial-gradient(circle,rgba(230,178,74,.14),transparent_70%)]
        "
      />

      <div className="relative z-10 text-center">

        <Reveal>
          <div className="flex justify-center">
            <SectionBadge>
              JOIN EVANTRA
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

              md:text-7xl
            "
          >
            Building Tomorrow
            <br />

            <span className="text-ev-gold-gradient">
              Starts Today
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
            Whether you're looking to partner, innovate,
            invest or build the future with us,
            Evantra welcomes visionaries who believe
            technology should serve people.
          </p>
        </Reveal>

        <CallToActionActions />

        <CallToActionStats />

      </div>
    </SectionContainer>
  );
}