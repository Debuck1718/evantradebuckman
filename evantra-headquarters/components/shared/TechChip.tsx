"use client";

import { motion } from "framer-motion";

interface TechChipProps {
  /** Text displayed inside the chip */
  label: string;

  /** Highlight chip */
  active?: boolean;

  /** Optional click handler */
  onClick?: () => void;

  /** Additional Tailwind classes */
  className?: string;
}

export default function TechChip({
  label,
  active = false,
  onClick,
  className = "",
}: TechChipProps) {
  const interactive = typeof onClick === "function";

  const Component = interactive
    ? motion.button
    : motion.div;

  return (
    <Component
      type={interactive ? "button" : undefined}
      onClick={onClick}
      whileHover={{
        y: -2,
        scale: 1.04,
      }}
      whileTap={
        interactive
          ? {
              scale: 0.97,
            }
          : undefined
      }
      transition={{
        duration: 0.2,
      }}
      className={`
        inline-flex

        items-center
        justify-center

        rounded-full

        border

        px-4
        py-2

        text-sm
        font-medium
        tracking-wide

        backdrop-blur-xl

        transition-all
        duration-300

        ${
          active
            ? `
              border-[hsl(var(--accent))]/50
              bg-[hsl(var(--accent))]/15
              text-[hsl(var(--accent))]
              shadow-[0_0_18px_rgba(212,175,55,.18)]
            `
            : `
              border-white/10
              bg-white/5
              text-white/80

              hover:border-[hsl(var(--accent))]/35
              hover:bg-[hsl(var(--accent))]/10
              hover:text-[hsl(var(--accent))]
            `
        }

        ${
          interactive
            ? `
              cursor-pointer
              focus:outline-none
              focus:ring-2
              focus:ring-[hsl(var(--accent))]
              focus:ring-offset-2
              focus:ring-offset-[#081521]
            `
            : ""
        }

        ${className}
      `}
    >
      {label}
    </Component>
  );
}