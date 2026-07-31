"use client";

import Reveal from "@/components/shared/Reveal";

import InnovationHighlightCard from "./InnovationHighlightCard";
import { innovationCampusData } from "./innovationCampusData";

export default function InnovationHighlights() {
  return (
    <div
      className="
        mt-24

        grid
        gap-8

        md:grid-cols-2

        xl:grid-cols-5
      "
    >
      {innovationCampusData.map((item) => (
        <Reveal
          key={item.id}
          direction="up"
        >
          <InnovationHighlightCard
            item={item}
          />
        </Reveal>
      ))}
    </div>
  );
}