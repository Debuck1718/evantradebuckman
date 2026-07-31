"use client";

import HeroActions from "./HeroActions";
import HeroCapabilities from "./HeroCapabilities";

import Reveal from "@/components/shared/Reveal";
import SectionBadge from "@/components/shared/SectionBadge";

export default function HeroContent() {
  return (
    <div
      className="
        relative
        z-20

        flex
        max-w-[560px]
        flex-col

        pt-32

        lg:pt-36
      "
    >
      {/* Headquarters Badge */}

      <Reveal>
        <SectionBadge
          className="
            border-[#E6B24A]/35
            bg-[#E6B24A]/10
            text-[#E6B24A]
            backdrop-blur-xl
          "
        >
          EVANTRA HEADQUARTERS
        </SectionBadge>
      </Reveal>

      {/* Main Heading */}

      <Reveal delay={0.08}>
        <h1
          className="
            mt-8

            text-[54px]
            font-bold

            leading-[0.88]
            tracking-tight

            text-white

            md:text-[68px]

            xl:text-[82px]
          "
        >
          Building Africa's
          <br />
          Next Technology
          <br />

          <span
            className="
              bg-gradient-to-r
              from-[#F7D97F]
              via-[#E6B24A]
              to-[#C99322]

              bg-clip-text

              text-transparent

              drop-shadow-[0_2px_10px_rgba(230,178,74,.35)]
            "
          >
            Enterprise
          </span>
        </h1>
      </Reveal>

      {/* Accent Line */}

      <Reveal delay={0.15}>
        <div
          className="
            mt-10

            h-[3px]
            w-24

            rounded-full

            bg-gradient-to-r
            from-[#F7D97F]
            via-[#E6B24A]
            to-[#C99322]
          "
        />
      </Reveal>

      {/* Supporting Copy */}

      <Reveal delay={0.22}>
        <div className="mt-10">

          <p
            className="
              text-[34px]

              font-light

              leading-tight

              tracking-tight

              text-white/95
            "
          >
            Engineering. Research. Innovation.
          </p>

          <p
            className="
              mt-8

              text-[44px]

              font-semibold

              leading-[1.08]

              tracking-tight

              bg-gradient-to-r
              from-[#F7D97F]
              via-[#E6B24A]
              to-[#C99322]

              bg-clip-text

              text-transparent

              drop-shadow-[0_2px_12px_rgba(230,178,74,.25)]
            "
          >
            Engineering Technology
            <br />
            That Serves People.
          </p>

        </div>
      </Reveal>

      {/* Hero Buttons */}

      <div className="mt-14">
        <HeroActions />
      </div>

      {/* Capability Bar */}

      <div className="mt-20">
        <HeroCapabilities />
      </div>
    </div>
  );
}