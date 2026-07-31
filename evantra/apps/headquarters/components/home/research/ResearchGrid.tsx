"use client";

import Reveal from "@/components/shared/Reveal";

import ResearchCard from "./ResearchCard";
import { researchData } from "./researchData";

export default function ResearchGrid() {
  return (
    <div
      className="
        grid
        gap-8

        md:grid-cols-2

        xl:grid-cols-3
      "
    >
      {researchData.map((item) => (
        <Reveal
          key={item.id}
          direction="up"
        >
          <ResearchCard item={item} />
        </Reveal>
      ))}
    </div>
  );
}