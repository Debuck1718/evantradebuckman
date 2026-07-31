"use client";

import { motion } from "framer-motion";

export default function ShowcaseBackground() {
  return (
    <>
      {/* ==========================================
          Gradient Mesh
      =========================================== */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(circle_at_15%_20%,rgba(11,92,171,0.18),transparent_38%),
                radial-gradient(circle_at_85%_15%,rgba(193,138,45,0.12),transparent_30%),
                radial-gradient(circle_at_50%_90%,rgba(11,92,171,0.10),transparent_42%)]
          "
        />
      </div>

      {/* ==========================================
          Engineering Grid
      =========================================== */}

      <div
        className="
          absolute
          inset-0

          opacity-[0.035]

          bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
          bg-[size:64px_64px]

          pointer-events-none
        "
      />

      {/* ==========================================
          Left Glow
      =========================================== */}

      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.45, 0.65, 0.45],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute

          -left-32
          top-20

          h-96
          w-96

          rounded-full

          bg-[hsl(var(--accent))]/15

          blur-[140px]

          pointer-events-none
        "
      />

      {/* ==========================================
          Right Glow
      =========================================== */}

      <motion.div
        animate={{
          scale: [1.08, 0.95, 1.08],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute

          -right-40
          bottom-0

          h-[28rem]
          w-[28rem]

          rounded-full

          bg-cyan-500/10

          blur-[160px]

          pointer-events-none
        "
      />

      {/* ==========================================
          Accent Orb
      =========================================== */}

      <motion.div
        animate={{
          y: [0, -18, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute

          left-1/2
          top-1/3

          h-40
          w-40

          -translate-x-1/2

          rounded-full

          bg-white/5

          blur-3xl

          pointer-events-none
        "
      />
    </>
  );
}