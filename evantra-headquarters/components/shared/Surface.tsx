"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface SurfaceProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;

  className?: string;

  hover?: boolean;

  glow?: boolean;

  blur?: boolean;

  border?: boolean;

  padding?: "none" | "sm" | "md" | "lg";

  rounded?: "lg" | "xl" | "2xl" | "3xl";

  variant?: "glass" | "solid" | "outline";
}

export default function Surface({
  children,
  className,

  hover = false,
  glow = false,
  blur = true,
  border = true,

  padding = "lg",
  rounded = "2xl",
  variant = "glass",

  ...props
}: SurfaceProps) {
  return (
    <motion.div
      {...props}
      whileHover={
        hover
          ? {
              y: -6,
              scale: 1.01,
            }
          : undefined
      }
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={clsx(
        "relative overflow-hidden transition-all duration-500",

        /* Border Radius */

        {
          "rounded-2xl": rounded === "lg",

          "rounded-[28px]": rounded === "xl",

          "rounded-[32px]": rounded === "2xl",

          "rounded-[40px]": rounded === "3xl",
        },

        /* Padding */

        {
          "p-0": padding === "none",

          "p-4": padding === "sm",

          "p-6": padding === "md",

          "p-8": padding === "lg",
        },

        /* Border */

        border && "border border-white/10",

        /* Background */

        {
          "bg-white/[0.05]": variant === "glass",

          "bg-[#07131f]": variant === "solid",

          "bg-transparent": variant === "outline",
        },

        /* Blur */

        blur && "backdrop-blur-xl",

        /* Glow */

        glow &&
          `
          shadow-[0_20px_70px_rgba(0,0,0,0.30)]
          hover:border-[hsl(var(--accent))]/40
          hover:shadow-[0_30px_80px_rgba(0,0,0,0.45)]
        `,

        className
      )}
    >
      {children}
    </motion.div>
  );
}