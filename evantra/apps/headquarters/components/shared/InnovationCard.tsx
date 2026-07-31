"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface InnovationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tags?: string[];
}

export default function InnovationCard({
  title,
  description,
  icon: Icon,
  tags = [],
}: InnovationCardProps) {
  return (
    <motion.article
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-white/[0.04]
        p-8
        backdrop-blur-xl
        transition-all
        duration-500
        hover:border-[hsl(var(--accent))]/40
        hover:bg-white/[0.06]
      "
    >
      {/* Icon */}

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-[hsl(var(--accent))]/10
          text-[hsl(var(--accent))]
        "
      >
        <Icon size={28} />
      </div>

      {/* Title */}

      <h3
        className="
          mt-8
          text-2xl
          font-semibold
          text-white
        "
      >
        {title}
      </h3>

      {/* Description */}

      <p
        className="
          mt-4
          leading-8
          text-white/70
        "
      >
        {description}
      </p>

      {/* Tags */}

      {tags.length > 0 && (
        <div
          className="
            mt-8
            flex
            flex-wrap
            gap-3
          "
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="
                rounded-full
                border
                border-white/10
                px-3
                py-1.5
                text-xs
                font-medium
                text-white/70
              "
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
}