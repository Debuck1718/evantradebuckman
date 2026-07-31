"use client";

import Reveal from "@/components/shared/Reveal";

import FeaturedCompanyCard from "./FeaturedCompanyCard";
import { companiesData } from "./companiesData";

export default function FeaturedCompaniesGrid() {
  return (
    <div
      className="
        relative

        mx-auto

        flex
        flex-col

        gap-32

        lg:gap-40
      "
    >
      {companiesData.map((center, index) => (
        <Reveal
          key={center.id}
          direction={index % 2 === 0 ? "left" : "right"}
          delay={0.04}
        >
          <FeaturedCompanyCard
            center={center}
            index={index}
          />
        </Reveal>
      ))}
    </div>
  );
}