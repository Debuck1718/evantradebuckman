"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const evantraButtonVariants = cva(
  `
    inline-flex
    items-center
    justify-center
    gap-2

    rounded-full

    whitespace-nowrap

    font-semibold

    transition-all
    duration-300

    outline-none

    focus-visible:ring-4
    focus-visible:ring-[hsl(var(--accent))/35]

    disabled:pointer-events-none
    disabled:opacity-50

    active:scale-[0.98]
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-[hsl(var(--accent))]
          text-[#06131F]

          hover:-translate-y-0.5
          hover:shadow-[0_16px_40px_rgba(210,163,57,.35)]
        `,

        secondary: `
          bg-[hsl(var(--primary))]
          text-white

          hover:brightness-105
        `,

        outline: `
          border
          border-[hsl(var(--accent))]

          bg-transparent

          text-[hsl(var(--accent))]

          hover:bg-[hsl(var(--accent))]
          hover:text-[#06131F]
        `,

        glass: `
          border
          border-white/15

          bg-white/10

          text-white

          backdrop-blur-2xl

          hover:bg-white/15
        `,

        ghost: `
          bg-transparent

          text-white

          hover:bg-white/10
        `,
      },

      size: {
        sm: `
          h-10
          px-5
          text-sm
        `,

        md: `
          h-12
          px-7
          text-base
        `,

        lg: `
          h-14
          px-9
          text-base
        `,

        xl: `
          h-16
          px-11
          text-lg
        `,
      },

      fullWidth: {
        true: "w-full",
        false: "",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface EvantraButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof evantraButtonVariants> {
  loading?: boolean;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;
}

export const EvantraButton = React.forwardRef<
  HTMLButtonElement,
  EvantraButtonProps
>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          evantraButtonVariants({
            variant,
            size,
            fullWidth,
          }),
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          leftIcon
        )}

        <span className="flex items-center">
          {children}
        </span>

        {!loading && rightIcon}
      </button>
    );
  }
);

EvantraButton.displayName = "EvantraButton";

export { evantraButtonVariants };