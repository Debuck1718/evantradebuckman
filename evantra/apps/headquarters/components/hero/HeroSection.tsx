"use client";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";

import Reveal from "@/components/shared/Reveal";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="
        relative
        isolate
        min-h-screen
        overflow-hidden
      "
    >
      {/* Background */}

      <HeroBackground />

      {/* Dark Atmospheric Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#06131F]/70
          via-[#06131F]/35
          to-transparent
          z-10
        "
      />

      {/* Content Container */}

      <div
        className="
          relative
          z-20

          mx-auto

          flex

          min-h-screen

          max-w-[1500px]

          items-center

          px-8

          lg:px-16
        "
      >
        <div
          className="
            w-full

            lg:w-[42%]
          "
        >
          <HeroContent />
        </div>

        {/* Right side intentionally left empty.
            The headquarters image itself occupies this space. */}

        <div
          className="
            hidden

            lg:block

            lg:w-[58%]
          "
        />
      </div>

      {/* Scroll Indicator */}

      <Reveal delay={1.1}>
        <div
          className="
            absolute

            bottom-8

            left-1/2

            z-20

            -translate-x-1/2
          "
        >
          <button
            onClick={() =>
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              })
            }
            className="
              group

              flex

              flex-col

              items-center

              gap-3

              text-white/70

              transition-all

              duration-300

              hover:text-white
            "
          >
            <span
              className="
                text-xs

                uppercase

                tracking-[0.35em]
              "
            >
              Scroll to Explore
            </span>

            <ChevronDown
              className="
                h-6

                w-6

                animate-bounce

                transition-transform

                group-hover:translate-y-1
              "
            />
          </button>
        </div>
      </Reveal>
    </section>
  );
}