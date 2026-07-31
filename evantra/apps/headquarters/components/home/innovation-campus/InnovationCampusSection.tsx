"use client";

import SectionContainer from "@/components/shared/SectionContainer";

import InnovationCampusHero from "./InnovationCampusHero";
import InnovationHighlights from "./InnovationHighlights";

export default function InnovationCampusSection() {
  return (
    <SectionContainer
      id="innovation-campus"
      className="
        relative

        bg-gradient-to-b

        from-slate-50

        via-white

        to-slate-50
      "
    >
      {/* Background Glow */}

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

          bg-[radial-gradient(circle,rgba(230,178,74,.08),transparent_70%)]
        "
      />

      <div className="relative z-10">

        <InnovationCampusHero />

        <InnovationHighlights />

      </div>
    </SectionContainer>
  );
}