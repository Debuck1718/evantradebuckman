"use client";

import SectionContainer from "@/components/shared/SectionContainer";

import ResearchHeader from "./ResearchHeader";
import ResearchGrid from "./ResearchGrid";

export default function ResearchSection() {
  return (
    <SectionContainer
      id="research"
      className="
        relative

        overflow-hidden

        bg-[#06131F]
      "
    >
      {/* Ambient Glow */}

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

          bg-[radial-gradient(circle,rgba(230,178,74,.10),transparent_70%)]
        "
      />

      <div className="relative z-10">

        <ResearchHeader />

        <ResearchGrid />

      </div>
    </SectionContainer>
  );
}