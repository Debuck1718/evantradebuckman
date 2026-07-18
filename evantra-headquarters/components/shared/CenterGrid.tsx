"use client";

import CenterCard from "./CenterCard";

import {
  headquartersCenters,
  type HeadquartersCenter,
} from "@/data/headquarters";

import { cn } from "@/lib/utils";

interface CenterGridProps {
  centers?: HeadquartersCenter[];

  title?: string;

  description?: string;

  columns?: 2 | 3;

  className?: string;
}

export default function CenterGrid({
  centers = headquartersCenters,

  title,

  description,

  columns = 3,

  className,
}: CenterGridProps) {
  return (
    <section className={cn("w-full", className)}>
      {(title || description) && (
        <div className="mx-auto mb-14 max-w-3xl text-center">
          {title && (
            <h2 className="text-4xl font-bold text-white">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-6 text-lg leading-8 text-white/70">
              {description}
            </p>
          )}
        </div>
      )}

      <div
        className={cn(
          "grid gap-8",
          columns === 2
            ? "lg:grid-cols-2"
            : "md:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {centers.map((center) => (
          <CenterCard
            key={center.id}
            center={center}
          />
        ))}
      </div>
    </section>
  );
}