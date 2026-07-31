"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

import Surface from "@/components/shared/Surface";
import { fadeUp } from "@/lib/animations/featuredShowcase";

interface HighlightCardProps {
  title: string;

  description: string;

  icon: LucideIcon;

  className?: string;
}

export default function HighlightCard({
  title,
  description,
  icon: Icon,
  className,
}: HighlightCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      className={className}
    >
      <Surface
        hover
        glow
        padding="md"
        rounded="xl"
        className="
          h-full
          bg-white/[0.05]
        "
      >
        <div className="flex items-start gap-4">
          {/* Icon */}

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center

              rounded-2xl

              bg-[hsl(var(--accent))]/10

              text-[hsl(var(--accent))]
            "
          >
            <Icon size={22} />
          </div>

          {/* Content */}

          <div className="min-w-0">
            <h4
              className="
                text-base
                font-semibold
                text-white
              "
            >
              {title}
            </h4>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-white/65
              "
            >
              {description}
            </p>
          </div>
        </div>
      </Surface>
    </motion.div>
  );
}