"use client";

import Reveal from "@/components/shared/Reveal";
import StaggerChildren from "@/components/shared/StaggerChildren";

import EcosystemCard from "./EcosystemCard";
import { ecosystemData } from "./ecosystemData";

export default function EcosystemGrid() {
  return (
    <StaggerChildren
      stagger={0.12}
      delayChildren={0.25}
      className="
        grid
        gap-8

        sm:grid-cols-2

        xl:grid-cols-3
      "
    >
      {ecosystemData.map((item) => (
        <Reveal
          key={item.id}
          direction="up"
        >
          <EcosystemCard item={item} />
        </Reveal>
      ))}
    </StaggerChildren>
  );
}