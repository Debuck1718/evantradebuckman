"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import clsx from "clsx";

interface CampusMarkerProps {
  x: number;
  y: number;

  active?: boolean;

  accent?: "gold" | "blue" | "teal";

  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

const accentStyles = {
  gold: {
    bg: "bg-amber-400",
    ring: "ring-amber-400/40",
    shadow: "shadow-amber-400/40",
  },

  blue: {
    bg: "bg-sky-500",
    ring: "ring-sky-500/40",
    shadow: "shadow-sky-500/40",
  },

  teal: {
    bg: "bg-teal-500",
    ring: "ring-teal-500/40",
    shadow: "shadow-teal-500/40",
  },
};

export default function CampusMarker({
  x,
  y,
  active = false,
  accent = "gold",
  onMouseEnter,
  onMouseLeave,
  onClick,
}: CampusMarkerProps) {
  const style = accentStyles[accent];

  return (
    <motion.button
      type="button"
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Pulse */}
      <motion.span
        className={clsx(
          "absolute inset-0 rounded-full",
          style.bg,
          "opacity-30"
        )}
        animate={{
          scale: [1, 2.4],
          opacity: [0.45, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />

      {/* Ring */}
      <div
        className={clsx(
          "absolute inset-0 rounded-full ring-8",
          style.ring
        )}
      />

      {/* Main Marker */}
      <div
        className={clsx(
          "relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white shadow-xl backdrop-blur-md transition-all duration-300",
          style.bg,
          style.shadow,
          active && "scale-110"
        )}
      >
        <MapPin size={18} strokeWidth={2.4} />
      </div>
    </motion.button>
  );
}