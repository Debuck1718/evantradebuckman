"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { CampusLocation } from "./CampusMapData";
import { EvantraButton } from "../shared/EvantraButton";

interface CampusTooltipProps {
  building: CampusLocation;
}

export default function CampusTooltip({
  building,
}: CampusTooltipProps) {
  return (
    <div className="absolute left-8 top-0 z-40 w-[360px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">

      {/* Image */}

      <div className="relative h-48 w-full">
        <Image
          src={building.image}
          alt={building.name}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />
      </div>

      {/* Content */}

      <div className="space-y-5 p-6">

        <div>

          <span className="text-xs uppercase tracking-[0.25em] text-amber-400">
            {building.category}
          </span>

          <h3 className="mt-2 text-2xl font-bold text-white">
            {building.name}
          </h3>

          <p className="mt-2 text-sm leading-7 text-slate-300">
            {building.description}
          </p>

        </div>

        {/* Technologies */}

        <div className="flex flex-wrap gap-2">

          {building.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
            >
              {tech}
            </span>
          ))}

        </div>

        {/* CTA */}

        <Link href={building.href}>

          <EvantraButton
            variant="primary"
            className="w-full"
          >
            Explore Center

            <ArrowRight className="ml-2 h-4 w-4" />

          </EvantraButton>

        </Link>

      </div>

    </div>
  );
}