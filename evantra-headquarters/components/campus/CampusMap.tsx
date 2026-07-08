"use client";

import { useState } from "react";

// Using native img element instead of CampusImage component because
// the shared CampusImage module may not be available as a module.

import CampusMarker from "./CampusMarker";
import CampusTooltip from "./CampusTooltip";
import { campusMapData, CampusLocation } from "./CampusMapData";

export default function CampusMap() {
  const [activeBuilding, setActiveBuilding] =
    useState<CampusLocation | null>(null);

  return (
    <div className="relative mx-auto w-full max-w-7xl">

      {/* Campus Image */}

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 shadow-2xl">

        <img
          src="/images/campus/campus-aerial.webp"
          alt="Evantra Innovation Campus"
          className="aspect-[16/9] w-full object-cover"
        />

        {/* Dark Gradient */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

        {/* Markers */}

        {campusMapData.map((building) => (
          <CampusMarker
            key={building.id}
            x={building.x}
            y={building.y}
            accent={building.accent}
            active={activeBuilding?.id === building.id}
            onMouseEnter={() => setActiveBuilding(building)}
            onMouseLeave={() => setActiveBuilding(null)}
            onClick={() => setActiveBuilding(building)}
          />
        ))}

        {/* Tooltip */}

        {activeBuilding && (
          <div
            className="absolute z-50 -translate-y-1/2"
            style={{
              left: `${activeBuilding.x}%`,
              top: `${activeBuilding.y}%`,
            }}
          >
            <CampusTooltip
              building={activeBuilding}
            />
          </div>
        )}

      </div>

    </div>
  );
}