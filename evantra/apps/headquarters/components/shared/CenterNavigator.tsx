"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Grid2x2 } from "lucide-react";

import CenterCard from "./CenterCard";

import {
  getNextCenter,
  getPreviousCenter,
  getRelatedCenters,
} from "@/data/headquarters";

interface CenterNavigatorProps {
  currentSlug: string;
}

export default function CenterNavigator({
  currentSlug,
}: CenterNavigatorProps) {
  const previous = getPreviousCenter(currentSlug);
  const next = getNextCenter(currentSlug);
  const related = getRelatedCenters(currentSlug);

  return (
    <section className="mt-40 border-t border-white/10 pt-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
            Continue Exploring
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Explore Evantra Headquarters
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/70">
            Every Evantra Center collaborates to transform research,
            engineering and innovation into products that create lasting
            impact.
          </p>
        </div>

        {/* Previous / Next */}

        <div className="mt-20 grid gap-8 lg:grid-cols-2">

          {previous ? (
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-white/50">
                <ArrowLeft size={16} />
                Previous Center
              </div>

              <CenterCard center={previous} />
            </div>
          ) : (
            <div />
          )}

          {next ? (
            <div>
              <div className="mb-4 flex items-center justify-end gap-2 text-sm uppercase tracking-widest text-white/50">
                Next Center
                <ArrowRight size={16} />
              </div>

              <CenterCard center={next} />
            </div>
          ) : (
            <div />
          )}

        </div>

        {/* Related Centers */}

        {related.length > 0 && (
          <>
            <div className="mt-24">
              <h3 className="text-3xl font-bold text-white">
                Related Centers
              </h3>

              <p className="mt-3 text-white/65">
                Discover other Evantra Centers that closely collaborate
                with this area.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((center) => (
                <CenterCard
                  key={center.id}
                  center={center}
                  variant="compact"
                />
              ))}
            </div>
          </>
        )}

        {/* Explore All */}

        <div className="mt-20 flex justify-center">

          <Link
            href="/companies"
            className="
              inline-flex
              items-center
              gap-3
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              px-7
              py-4
              text-white
              transition
              hover:border-white/20
              hover:bg-white/[0.06]
            "
          >
            <Grid2x2 size={18} />

            View All Centers
          </Link>

        </div>

      </div>
    </section>
  );
}