"use client";

import FooterBrand from "./FooterBrand";
import FooterNavigation from "./FooterNavigation";
import FooterNewsletter from "./FooterNewsletter";
import FooterBottom from "./FooterBottom";

export default function GlobalFooter() {
  return (
    <footer
      className="
        relative

        overflow-hidden

        bg-[#06131F]

        text-white
      "
    >
      {/* Background Grid */}

      <div
        className="
          absolute
          inset-0

          bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)]

          bg-[size:64px_64px]
        "
      />

      {/* Gold Glow */}

      <div
        className="
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

      <div
        className="
          relative
          z-10

          mx-auto

          max-w-[1320px]

          px-6

          py-24

          lg:px-10
        "
      >
        <div
          className="
            grid

            gap-20

            lg:grid-cols-[1.3fr_1fr]
          "
        >
          <FooterBrand />

          <FooterNewsletter />
        </div>

        <div className="mt-24">
          <FooterNavigation />
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}