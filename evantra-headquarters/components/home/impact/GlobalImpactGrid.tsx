"use client";

import Reveal from "@/components/shared/Reveal";

import GlobalImpactCard from "./GlobalImpactCard";
import { impactData } from "./impactData";

export default function GlobalImpactGrid() {
  return (
    <div
      className="
        grid
        gap-8

        md:grid-cols-2

        xl:grid-cols-3
      "
    >
      {impactData.map((item) => (
        <Reveal
          key={item.id}
          direction="up"
        >
          <GlobalImpactCard item={item} />
        </Reveal>
      ))}
    </div>
  );
}