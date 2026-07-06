"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: ReactNode;
  className?: string;
}

export default function SectionBadge({
  children,
  className,
}: SectionBadgeProps) {
  return (
    <div
      className={cn(
        `
          inline-flex
          w-fit
          items-center
          gap-3

          rounded-full

          border
          border-[#E6B24A]/35

          bg-[#E6B24A]/10

          px-6
          py-2.5

          backdrop-blur-xl

          transition-all
          duration-300

          hover:border-[#E6B24A]/50
          hover:bg-[#E6B24A]/15
        `,
        className
      )}
    >
      {/* Indicator */}

      <span
        className="
          h-2.5
          w-2.5

          rounded-full

          bg-[#E6B24A]

          shadow-[0_0_12px_rgba(230,178,74,.65)]
        "
      />

      {/* Label */}

      <span
        className="
          text-[11px]
          font-semibold

          uppercase

          tracking-[0.28em]

          text-[#E6B24A]
        "
      >
        {children}
      </span>
    </div>
  );
}