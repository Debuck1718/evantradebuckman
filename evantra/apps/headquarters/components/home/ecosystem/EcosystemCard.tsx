"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import {
  ecosystemCapabilities,
  type EcosystemItem,
} from "./ecosystemData";

interface EcosystemCardProps {
  item: EcosystemItem;
}

export default function EcosystemCard({ item }: EcosystemCardProps) {
  const Icon = item.icon;

  const capabilities =
    ecosystemCapabilities[item.id as keyof typeof ecosystemCapabilities] ?? [];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        group
        relative

        flex
        h-full
        flex-col

        overflow-hidden

        rounded-[28px]

        border
        border-slate-200/80

        bg-white

        p-8

        transition-premium

        hover:border-slate-300
        hover:shadow-[0_30px_70px_-30px_rgba(15,23,42,.28)]
      "
    >
      {/* Brand glow */}

      <div
        aria-hidden
        className="
          pointer-events-none

          absolute
          -right-16
          -top-16

          h-40
          w-40

          rounded-full

          opacity-0

          blur-3xl

          transition-opacity
          duration-500

          group-hover:opacity-100
        "
        style={{ backgroundColor: `${item.color}24` }}
      />

      {/* Top row */}

      <div className="relative flex items-start justify-between gap-4">
        <div
          className="
            flex
            h-14
            w-14

            items-center
            justify-center

            rounded-2xl

            transition-premium

            group-hover:scale-105
          "
          style={{ backgroundColor: `${item.color}14` }}
        >
          <Icon className="h-7 w-7" style={{ color: item.color }} />
        </div>

        <span
          className="
            inline-flex
            items-center
            gap-2

            rounded-full

            border
            border-slate-200

            bg-white/80

            px-3
            py-1.5

            text-[11px]
            font-semibold
            uppercase
            tracking-[0.16em]

            text-slate-500
          "
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />

          {item.status}
        </span>
      </div>

      {/* Identity */}

      <div className="relative mt-8">
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.22em]
          "
          style={{ color: item.color }}
        >
          {item.eyebrow}
        </p>

        <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          {item.title}
        </h3>

        <p className="mt-2 text-base font-medium text-slate-700">
          {item.tagline}
        </p>
      </div>

      {/* Description */}

      <p className="relative mt-4 flex-1 text-[15px] leading-7 text-slate-600">
        {item.description}
      </p>

      {/* Capabilities */}

      {capabilities.length > 0 && (
        <ul className="relative mt-6 flex flex-wrap gap-2">
          {capabilities.map(({ label, icon: CapabilityIcon }) => (
            <li
              key={label}
              className="
                inline-flex
                items-center
                gap-1.5

                rounded-full

                border
                border-slate-200

                bg-slate-50

                px-3
                py-1.5

                text-xs
                font-medium

                text-slate-600
              "
            >
              <CapabilityIcon className="h-3.5 w-3.5" aria-hidden />

              {label}
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}

      <div
        className="
          relative
          mt-8

          flex
          items-center
          justify-between
          gap-4

          border-t
          border-slate-200/80

          pt-5
        "
      >
        <span className="truncate text-sm text-slate-400">
          {item.domain}
        </span>

        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visit ${item.title} (opens in a new tab)`}
          className="
            inline-flex
            shrink-0
            items-center
            gap-2

            text-sm
            font-semibold

            transition-premium

            hover:gap-3
          "
          style={{ color: item.color }}
        >
          Visit {item.title}

          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </a>
      </div>
    </motion.article>
  );
}
