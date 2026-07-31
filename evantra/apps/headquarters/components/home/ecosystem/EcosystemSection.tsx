"use client";

import SectionContainer from "@/components/shared/SectionContainer";

import EcosystemHeader from "./EcosystemHeader";
import EcosystemGrid from "./EcosystemGrid";

export default function EcosystemSection() {
  return (
    <SectionContainer
      id="ecosystem"
      className="
        relative

        bg-gradient-to-b
        from-white
        via-slate-50/70
        to-white
      "
    >
      {/* Engineering Background */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          bg-[linear-gradient(rgba(15,23,42,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.03)_1px,transparent_1px)]

          bg-[size:72px_72px]
        "
      />

      {/* Soft Radial Glow */}

      <div
        className="
          pointer-events-none

          absolute

          left-1/2
          top-0

          h-[600px]
          w-[600px]

          -translate-x-1/2

          rounded-full

          bg-[radial-gradient(circle,rgba(230,178,74,.08),transparent_70%)]
        "
      />

      <div className="relative z-10">
        <EcosystemHeader />

        <EcosystemGrid />
      </div>
    </SectionContainer>
  );
}