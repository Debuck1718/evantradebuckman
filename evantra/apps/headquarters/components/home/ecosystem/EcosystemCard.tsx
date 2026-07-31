"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import type { EcosystemItem } from "./ecosystemData";

interface EcosystemCardProps {
  item: EcosystemItem;
}

export default function EcosystemCard({
  item,
}: EcosystemCardProps) {
  const Icon = item.icon;

  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="group h-full"
    >
      <Link
        href={item.href}
        className="
          glass-card

          flex
          h-full
          flex-col

          rounded-[28px]

          border

          border-transparent

          bg-white

          p-8

          transition-premium

          hover:border-ev-gold

          hover:shadow-[0_25px_60px_rgba(0,0,0,.10)]
        "
      >
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

            transition-premium

            group-hover:scale-105
          "
        >
          <Icon
            className="
              h-8
              w-8

              text-ev-gold

              transition-premium
            "
          />
        </div>

        {/* Eyebrow */}

        <p
          className="
            mt-8

            text-xs

            font-semibold

            uppercase

            tracking-[0.22em]

            text-ev-gold
          "
        >
          {item.eyebrow}
        </p>

        {/* Title */}

        <h3
          className="
            mt-3

            text-2xl

            font-bold

            tracking-tight

            text-slate-900
          "
        >
          {item.title}
        </h3>

        {/* Description */}

        <p
          className="
            mt-5

            flex-1

            text-base

            leading-8

            text-slate-600
          "
        >
          {item.description}
        </p>

        {/* Footer */}

        <div
          className="
            mt-8

            flex

            items-center

            font-semibold

            text-ev-gold
          "
        >
          <span>Explore Division</span>

          <ArrowRight
            className="
              ml-3

              h-5
              w-5

              transition-transform

              duration-300

              group-hover:translate-x-2
            "
          />
        </div>
      </Link>
    </motion.div>
  );
}