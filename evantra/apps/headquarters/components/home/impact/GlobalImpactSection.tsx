"use client";

import SectionContainer from "@/components/shared/SectionContainer";

import GlobalImpactHeader from "./GlobalImpactHeader";
import GlobalImpactGrid from "./GlobalImpactGrid";

export default function GlobalImpactSection() {
  return (
    <SectionContainer
      id="impact"
      className="
        relative

        overflow-hidden

        bg-gradient-to-b

        from-white

        via-slate-50

        to-white
      "
    >
      {/* Soft Background Glow */}

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

        <GlobalImpactHeader />

        <GlobalImpactGrid />

      </div>
    </SectionContainer>
  );
}