"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

import Surface from "@/components/shared/Surface";
import { floatingMetric } from "@/lib/animations/featuredShowcase";

interface FloatingMetricProps {
  label: string;

  value: string;

  icon?: React.ReactNode;

  className?: string;
}

export default function FloatingMetric({
  label,
  value,
  icon,
  className,
}: FloatingMetricProps) {
  return (
    <motion.div
      // cast to any to satisfy framer-motion typings for complex transition easings
      animate={floatingMetric.animate as any}
      className={clsx("absolute", className)}
    >
      <Surface
        variant="glass"
        padding="md"
        rounded="xl"
        glow
        className="
          min-w-[170px]
          border-white/10
          bg-white/[0.06]
        "
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[hsl(var(--accent))]/10
                text-[hsl(var(--accent))]
              "
            >
              {icon}
            </div>
          )}

          <div className="flex flex-col">
            <span
              className="
                text-xs
                uppercase
                tracking-[0.18em]
                text-white/50
              "
            >
              {label}
            </span>

            <span
              className="
                mt-1
                text-2xl
                font-bold
                tracking-tight
                text-white
              "
            >
              {value}
            </span>
          </div>
        </div>
      </Surface>
    </motion.div>
  );
}