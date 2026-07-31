"use client";

import { useMemo, useState } from "react";

import CampusImage from "@/components/shared/CampusImage";
import GlassCard from "@/components/shared/GlassCard";

import CampusMarker from "./CampusMarker";
import CampusTooltip from "./CampusTooltip";

import { campusMapData } from "./CampusMapData";
import type { CampusCenter } from "./types";

export default function CampusMap() {
  // Headquarters is selected by default.
  const [selectedId, setSelectedId] = useState("headquarters");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = hoveredId ?? selectedId;

  const activeCenter: CampusCenter =
  useMemo(() => {
    return (
      campusMapData.find(
        (center) => center.id === activeId
      ) ?? campusMapData[0]
    );
  }, [activeId]);

  return (
    <div className="mx-auto max-w-7xl">

      <GlassCard
        className="
          overflow-hidden
          border-white/10
          bg-[#081521]
          p-0
        "
      >
        {/* ================================================= */}
        {/* Campus Map */}
        {/* ================================================= */}

        <div className="relative">

          <CampusImage
            src="/images/campus/campus-aerial.webp"
            alt="Interactive Evantra Innovation Campus"
            aspectRatio="16:9"
            priority
          />

          {/* Campus Markers */}

          {campusMapData.map((center) => (
            <CampusMarker
              key={center.id}
              center={center}
              active={activeId === center.id}
              onHover={() => setHoveredId(center.id)}
              onLeave={() => setHoveredId(null)}
              onSelect={() => setSelectedId(center.id)}
            />
          ))}
        </div>

        {/* ================================================= */}
        {/* Information Panel */}
        {/* ================================================= */}

        <div className="border-t border-white/10">

          <CampusTooltip
            center={activeCenter}
          />

        </div>
      </GlassCard>

    </div>
  );
}