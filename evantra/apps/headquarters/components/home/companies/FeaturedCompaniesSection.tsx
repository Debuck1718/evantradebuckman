"use client";

import SectionContainer from "@/components/shared/SectionContainer";

import FeaturedCompaniesHeader from "./FeaturedCompaniesHeader";
import FeaturedCompaniesGrid from "./FeaturedCompaniesGrid";

export default function FeaturedCompaniesSection() {
  return (
    <SectionContainer
      id="campus"
      className="
        relative
        overflow-hidden

        bg-white

        py-32
        lg:py-40
      "
    >
      {/* ================================================= */}
      {/* Engineering Blueprint Background */}
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
      {/* Gold Glow */}
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

          bg-[radial-gradient(circle,rgba(230,178,74,.10),transparent_72%)]
        "
      />

      {/* ================================================= */}
      {/* Soft White Fade */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          bg-gradient-to-b

          from-white/70

          via-transparent

          to-white/80
        "
      />

      {/* ================================================= */}
      {/* Content */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10

          mx-auto

          max-w-[1440px]
        "
      >
        <FeaturedCompaniesHeader />

        <div className="mt-24">
          <FeaturedCompaniesGrid />
        </div>
      </div>
    </SectionContainer>
  );
}