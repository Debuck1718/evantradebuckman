"use client";

import { ReactNode } from "react";
import clsx from "clsx";

import { SectionThemeProvider } from "./SectionThemeContext";

interface CompanySectionProps {
  id?: string;

  children: ReactNode;

  background?: "transparent" | "dark" | "light" | "gradient";

  width?: "default" | "wide" | "full";

  spacing?: "sm" | "md" | "lg";

  divider?: boolean;

  className?: string;
}

export default function CompanySection({
  id,
  children,
  background = "transparent",
  width = "default",
  spacing = "lg",
  divider = false,
  className,
}: CompanySectionProps) {
  const theme =
    background === "dark" || background === "gradient"
      ? "dark"
      : "light";

  return (
    <SectionThemeProvider theme={theme}>
      <section
        id={id}
        className={clsx(
          "relative overflow-hidden",
          {
            "bg-transparent":
              background === "transparent",

            "bg-[#07131f]":
              background === "dark",

            "bg-white":
              background === "light",

            "bg-gradient-to-b from-[#07131f] via-[#0b1b2b] to-[#07131f]":
              background === "gradient",

            "py-16 lg:py-20":
              spacing === "sm",

            "py-24 lg:py-28":
              spacing === "md",

            "py-32 lg:py-36":
              spacing === "lg",
          },
          className
        )}
      >
        {divider && (
          <div
            className="
              absolute
              top-0
              left-1/2
              h-px
              w-[90%]
              -translate-x-1/2
              bg-gradient-to-r
              from-transparent
              via-white/10
              to-transparent
            "
          />
        )}

        <div
          className={clsx(
            "relative z-10 mx-auto px-6",
            {
              "max-w-6xl":
                width === "default",

              "max-w-7xl":
                width === "wide",

              "max-w-none":
                width === "full",
            }
          )}
        >
          {children}
        </div>
      </section>
    </SectionThemeProvider>
  );
}