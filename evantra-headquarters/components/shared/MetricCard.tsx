"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import GlassCard from "./GlassCard";

interface MetricCardProps {
  value: string;

  label: string;

  description?: string;

  icon?: LucideIcon;

  trend?: string;

  featured?: boolean;

  className?: string;
}

export default function MetricCard({
  value,
  label,
  description,
  icon: Icon,
  trend,
  featured = false,
  className = "",
}: MetricCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      className={className}
    >
      <GlassCard
        className={`
          group

          relative

          h-full

          overflow-hidden

          p-8

          transition-all
          duration-500

          ${
            featured
              ? "ring-1 ring-[hsl(var(--accent))]/30"
              : ""
          }
        `}
      >
        {/* ================================================= */}
        {/* Accent Glow */}
        {/* ================================================= */}

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            opacity-0

            transition-opacity
            duration-500

            group-hover:opacity-100

            bg-[radial-gradient(circle_at_top_right,rgba(11,92,171,.12),transparent_65%)]
          "
        />

        {/* ================================================= */}
        {/* Top */}
        {/* ================================================= */}

        <div
          className="
            flex

            items-start
            justify-between
          "
        >
          <div>
            <h3
              className="
                text-5xl

                font-bold

                tracking-tight

                text-white
              "
            >
              {value}
            </h3>

            <p
              className="
                mt-3

                text-lg

                font-semibold

                text-white
              "
            >
              {label}
            </p>
          </div>

          {Icon && (
            <div
              className="
                flex

                h-14
                w-14

                items-center
                justify-center

                rounded-2xl

                border

                border-[hsl(var(--accent))]/20

                bg-[hsl(var(--accent))]/10

                text-[hsl(var(--accent))]
              "
            >
              <Icon size={26} />
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* Description */}
        {/* ================================================= */}

        {description && (
          <p
            className="
              mt-6

              leading-7

              text-white/65
            "
          >
            {description}
          </p>
        )}

        {/* ================================================= */}
        {/* Trend */}
        {/* ================================================= */}

        {trend && (
          <div
            className="
              mt-8

              inline-flex

              rounded-full

              border

              border-emerald-500/20

              bg-emerald-500/10

              px-4
              py-2

              text-sm

              font-semibold

              text-emerald-400
            "
          >
            {trend}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}