"use client";

import { useMemo, useState } from "react";

import Reveal from "@/components/shared/Reveal";
import StaggerChildren from "@/components/shared/StaggerChildren";
import { cn } from "@/lib/utils";

import EcosystemCard from "./EcosystemCard";
import {
  ecosystemCategories,
  ecosystemData,
  type EcosystemCategory,
} from "./ecosystemData";

export default function EcosystemGrid() {
  const [activeCategory, setActiveCategory] =
    useState<EcosystemCategory>("All products");

  const products = useMemo(() => {
    const sorted = [...ecosystemData].sort((a, b) => a.order - b.order);

    if (activeCategory === "All products") {
      return sorted;
    }

    return sorted.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div>
      {/* ================================================= */}
      {/* Category Filter */}
      {/* ================================================= */}

      <Reveal>
        <div
          role="tablist"
          aria-label="Filter ecosystem products by category"
          className="
            mb-16

            flex
            flex-wrap
            justify-center

            gap-3
          "
        >
          {ecosystemCategories.map((category) => {
            const active = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  `
                    rounded-full

                    border

                    px-5
                    py-2.5

                    text-sm
                    font-semibold

                    transition-premium
                  `,
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* ================================================= */}
      {/* Product Cards */}
      {/* ================================================= */}

      <StaggerChildren
        key={activeCategory}
        stagger={0.12}
        delayChildren={0.15}
        className="
          grid
          gap-8

          sm:grid-cols-2

          xl:grid-cols-3
        "
      >
        {products.map((item) => (
          <Reveal key={item.id} direction="up">
            <EcosystemCard item={item} />
          </Reveal>
        ))}
      </StaggerChildren>
    </div>
  );
}
