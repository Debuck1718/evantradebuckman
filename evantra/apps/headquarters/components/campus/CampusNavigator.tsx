"use client";

import Reveal from "@/components/shared/Reveal";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionHeading from "@/components/shared/SectionHeading";

import CampusMap from "./CampusMap";

export default function CampusNavigator() {
  return (
    <SectionContainer
      id="campus"
      className="
        relative
        overflow-hidden

        py-28
        lg:py-36
      "
    >
      {/* Background Glow */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute

            left-1/2
            top-0

            h-[700px]
            w-[700px]

            -translate-x-1/2

            rounded-full

            bg-[radial-gradient(circle,rgba(212,175,55,.08),transparent_70%)]
          "
        />
      </div>

      <div className="relative z-10">

        <SectionHeading
          badge="Interactive Campus"

          title="Navigate the"

          highlight="Evantra Innovation Campus"

          description="
            Explore our headquarters and
            specialized innovation centers
            through an interactive digital
            campus experience.
          "
        />

        <Reveal delay={0.15}>

          <div className="mt-16">

            <CampusMap />

          </div>

        </Reveal>

      </div>
    </SectionContainer>
  );
}