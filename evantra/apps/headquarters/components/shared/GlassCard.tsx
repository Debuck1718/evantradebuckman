"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const glassCardVariants = cva(
  `
    relative
    overflow-hidden
    rounded-3xl
    border
    transition-all
    duration-500
    backdrop-blur-2xl
  `,
  {
    variants: {
      variant: {
        default: `
          border-white/10
          bg-white/10
          shadow-[0_8px_40px_rgba(0,0,0,0.15)]
        `,

        dark: `
          border-white/10
          bg-slate-950/40
          shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        `,

        light: `
          border-slate-200
          bg-white/90
          shadow-xl
        `,

        gold: `
          border-[hsl(var(--accent))/0.35]
          bg-[hsl(var(--accent))/0.08]
          shadow-[0_8px_30px_rgba(193,138,45,0.15)]
        `,
      },

      hover: {
        true: `
          hover:-translate-y-2
          hover:shadow-2xl
          hover:border-[hsl(var(--accent))/0.45]
        `,
        false: "",
      },

      padding: {
        none: "p-0",

        sm: "p-4",

        md: "p-6",

        lg: "p-8",

        xl: "p-10",
      },
    },

    defaultVariants: {
      variant: "default",
      hover: true,
      padding: "lg",
    },
  }
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

export default function GlassCard({
  className,
  variant,
  hover,
  padding,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        glassCardVariants({
          variant,
          hover,
          padding,
        }),
        className
      )}
      {...props}
    >
      {/* Glass highlight */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-white/15
          via-transparent
          to-transparent
        "
      />

      {/* Gold glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-56
          w-56
          rounded-full
          bg-[hsl(var(--accent))/0.08]
          blur-3xl
        "
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}