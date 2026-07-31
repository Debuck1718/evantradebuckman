"use client";

import { motion } from "framer-motion";

interface VisionBannerProps {
  title: string;
  description: string;
}

export default function VisionBanner({
  title,
  description,
}: VisionBannerProps) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.7,
      }}
      className="
        relative
        overflow-hidden
        rounded-[40px]
        border
        border-white/10
        bg-gradient-to-br
        from-[#081521]
        via-[#0b1e2f]
        to-[#07131f]
        px-10
        py-20
        text-center
      "
    >
      {/* Decorative Glow */}

      <div
        className="
          absolute
          left-1/2
          top-0
          h-56
          w-56
          -translate-x-1/2
          rounded-full
          bg-[hsl(var(--accent))]/10
          blur-3xl
        "
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-[0.25em]
            text-[hsl(var(--accent))]
          "
        >
          Our Vision
        </p>

        <h2
          className="
            mt-6
            text-4xl
            font-bold
            leading-tight
            text-white
            md:text-5xl
          "
        >
          {title}
        </h2>

        <p
          className="
            mx-auto
            mt-8
            max-w-3xl
            text-lg
            leading-9
            text-white/75
          "
        >
          {description}
        </p>
      </div>
    </motion.section>
  );
}