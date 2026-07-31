"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type { ImpactArea } from "./impactData";

interface GlobalImpactCardProps {
  item: ImpactArea;
}

export default function GlobalImpactCard({
  item,
}: GlobalImpactCardProps) {
  const Icon = item.icon;

  return (
    <motion.article
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        group
        relative

        overflow-hidden

        rounded-[30px]

        border
        border-slate-200

        bg-white

        p-8

        shadow-[0_20px_60px_rgba(15,23,42,.08)]

        transition-all
        duration-500

        hover:border-ev-gold
      "
    >
      {/* Gold Accent */}

      <div
        className="
          absolute
          left-0
          top-0

          h-1
          w-full

          bg-ev-gold-gradient

          scale-x-0

          origin-left

          transition-transform
          duration-500

          group-hover:scale-x-100
        "
      />

      {/* Icon */}

      <div
        className="
          flex

          h-16
          w-16

          items-center
          justify-center

          rounded-2xl

          bg-ev-gold-soft
        "
      >
        <Icon className="h-8 w-8 text-ev-gold" />
      </div>

      <h3
        className="
          mt-8

          text-2xl

          font-bold

          tracking-tight

          text-slate-900
        "
      >
        {item.title}
      </h3>

      <p
        className="
          mt-5

          leading-8

          text-slate-600
        "
      >
        {item.description}
      </p>

      <div
        className="
          mt-8

          flex

          items-center

          text-sm

          font-semibold

          uppercase

          tracking-[0.18em]

          text-ev-gold
        "
      >
        Learn More

        <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    </motion.article>
  );
}