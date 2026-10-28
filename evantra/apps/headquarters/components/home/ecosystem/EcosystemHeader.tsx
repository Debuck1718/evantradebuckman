"use client";

import Reveal from "@/components/shared/Reveal";
import SectionBadge from "@/components/shared/SectionBadge";

import { ecosystemStats } from "./ecosystemData";

const stats = [
  {
    value: `${ecosystemStats.products}`,
    label: ecosystemStats.products === 1 ? "Partner product" : "Partner products",
  },
  { value: `${ecosystemStats.live} of ${ecosystemStats.products}`, label: "Live today" },
  { value: `${ecosystemStats.categories}`, label: "Sectors" },
];

export default function EcosystemHeader() {
  return (
    <div
      className="
        mx-auto
        mb-16
        max-w-4xl
        text-center
      "
    >
      <Reveal>
        <div className="flex justify-center">
          <SectionBadge>Evantra Ecosystem</SectionBadge>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2
          className="
            mt-8

            text-5xl
            font-bold
            tracking-tight

            text-slate-900

            md:text-6xl
          "
        >
          Products we build.
          <br />
          <span className="text-ev-gold-gradient">Partners we grow with</span>
        </h2>
      </Reveal>

      <Reveal delay={0.16}>
        <p
          className="
            mx-auto
            mt-8
            max-w-3xl

            text-xl
            leading-9

            text-slate-600
          "
        >
          Evantra is more than one company. Alongside our technology centers, we
          back independent ventures — media, creative studios and education
          platforms — that run on their own terms and launch from the same
          ecosystem.
        </p>
      </Reveal>

      <Reveal delay={0.24}>
        <div
          className="
            mx-auto
            mt-12

            flex
            flex-wrap
            items-center
            justify-center

            gap-6
            sm:gap-10
          "
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-6 sm:gap-10">
              {index > 0 && (
                <span className="hidden h-10 w-px bg-slate-200 sm:block" />
              )}

              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
