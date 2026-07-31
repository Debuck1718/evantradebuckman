"use client";

import { motion } from "framer-motion";

import type { CampusCenter } from "./types";

interface CampusMarkerProps {
  center: CampusCenter;
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}

export default function CampusMarker({
  center,
  active,
  onHover,
  onLeave,
  onSelect,
}: CampusMarkerProps) {
  return (
    <motion.button
      type="button"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
      whileHover={{
        scale: 1.15,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className="
        absolute

        -translate-x-1/2
        -translate-y-1/2

        focus:outline-none
      "
      style={{
        left: `${center.x}%`,
        top: `${center.y}%`,
      }}
    >
      {/* Pulse */}

      <motion.div
        animate={{
          scale: [1, 1.8],
          opacity: [0.45, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeOut",
        }}
        className="
          absolute

          left-1/2
          top-1/2

          h-10
          w-10

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-[hsl(var(--accent))]
        "
      />

      {/* Marker */}

      <motion.div
        animate={{
          scale: active ? 1.15 : 1,
        }}
        className={`
          relative

          flex

          h-5
          w-5

          items-center
          justify-center

          rounded-full

          border-2

          transition-all
          duration-300

          ${
            active
              ? `
                border-[hsl(var(--accent))]
                bg-[hsl(var(--accent))]
                shadow-[0_0_30px_rgba(212,175,55,.55)]
              `
              : `
                border-white
                bg-[#0B5CAB]
                shadow-[0_0_18px_rgba(11,92,171,.45)]
              `
          }
        `}
      >
        <div
          className="
            h-2
            w-2

            rounded-full

            bg-white
          "
        />
      </motion.div>

      {/* Active Label */}

      {active && (
        <motion.div
          initial={{
            opacity: 0,
            y: 6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
          }}
          className="
            absolute

            left-1/2
            top-8

            -translate-x-1/2

            whitespace-nowrap

            rounded-full

            border
            border-white/10

            bg-[#081521]/95

            px-4
            py-1.5

            text-xs
            font-semibold

            text-white

            shadow-xl

            backdrop-blur-xl
          "
        >
          {center.name}
        </motion.div>
      )}
    </motion.button>
  );
}