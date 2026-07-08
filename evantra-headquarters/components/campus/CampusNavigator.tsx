"use client";

import SectionContainer from "@/components/shared/SectionContainer";
import SectionHeading from "@/components/shared/SectionHeading";
import Reveal from "@/components/shared/Reveal";

import CampusMap from "./CampusMap";

export default function CampusNavigator() {
  return (
    <SectionContainer
      id="campus-navigator"
      className="
        relative
        overflow-hidden

        py-32
        lg:py-40
      "
    >
      {/* ================================================= */}
      {/* Blueprint Background */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0

          opacity-[0.03]

          [background-image:
            linear-gradient(rgba(15,23,42,.8)_1px,transparent_1px),
            linear-gradient(90deg,rgba(15,23,42,.8)_1px,transparent_1px)]

          [background-size:72px_72px]
        "
      />

      {/* ================================================= */}
      {/* Evantra Gold Glow */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none

          absolute

          left-1/2
          top-0

          h-[700px]
          w-[700px]

          -translate-x-1/2

          rounded-full

          bg-[radial-gradient(circle,rgba(230,178,74,.12),transparent_72%)]
        "
      />

      <div className="relative z-10">

        <SectionHeading
          badge="Interactive Campus"

          title="Navigate the"

          highlight="Evantra Innovation Campus"

          description="
            Explore our headquarters and specialized centers
            through an interactive campus experience. Select
            any building to discover its purpose, technologies,
            and the innovations taking shape inside.
          "
        />

        <Reveal delay={0.2}>
          <div className="mt-20">
            <CampusMap />
          </div>
        </Reveal>

      </div>
    </SectionContainer>
  );
}