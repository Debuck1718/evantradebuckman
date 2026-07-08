"use client";

import Reveal from "@/components/shared/Reveal";
import SectionBadge from "@/components/shared/SectionBadge";

export default function FeaturedCompaniesHeader() {
  return (
    <div
      className="
        mx-auto

        mb-24

        max-w-4xl

        text-center
      "
    >
      {/* ================================================= */}
      {/* Section Badge */}
      {/* ================================================= */}

      <Reveal>
        <div className="flex justify-center">
          <SectionBadge>
            Explore the Evantra Campus
          </SectionBadge>
        </div>
      </Reveal>

      {/* ================================================= */}
      {/* Heading */}
      {/* ================================================= */}

      <Reveal delay={0.08}>
        <h2
          className="
            mt-8

            text-5xl

            font-bold

            leading-[0.95]

            tracking-tight

            text-slate-900

            md:text-6xl

            xl:text-7xl
          "
        >
          Engineering Excellence
          <br />

          <span className="text-ev-gold">
            Across Every Discipline
          </span>
        </h2>
      </Reveal>

      {/* ================================================= */}
      {/* Gold Divider */}
      {/* ================================================= */}

      <Reveal delay={0.14}>
        <div
          className="
            mx-auto
            mt-10

            h-[3px]
            w-24

            rounded-full

            bg-ev-gold-gradient
          "
        />
      </Reveal>

      {/* ================================================= */}
      {/* Description */}
      {/* ================================================= */}

      <Reveal delay={0.18}>
        <p
          className="
            mx-auto

            mt-10

            max-w-3xl

            text-xl

            leading-9

            text-slate-600
          "
        >
          Discover the specialized centers that power the
          Evantra Innovation Campus—where enterprise software,
          cybersecurity, engineering, artificial intelligence,
          research, and global commerce come together to build
          technologies that serve people.
        </p>
      </Reveal>

      {/* ================================================= */}
      {/* Campus Statistics */}
      {/* ================================================= */}

      <Reveal delay={0.24}>
        <div
          className="
            mt-16

            flex
            flex-wrap

            items-center
            justify-center

            gap-8

            text-center
          "
        >
          <div>
            <p className="text-4xl font-bold text-ev-gold">
              6
            </p>

            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">
              Campus Centers
            </p>
          </div>

          <div className="hidden h-10 w-px bg-slate-200 md:block" />

          <div>
            <p className="text-4xl font-bold text-ev-gold">
              AI
            </p>

            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">
              Research Driven
            </p>
          </div>

          <div className="hidden h-10 w-px bg-slate-200 md:block" />

          <div>
            <p className="text-4xl font-bold text-ev-gold">
              One
            </p>

            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">
              Unified Campus
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}