"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { centerThemes } from "@/data/theme";
import type { HeadquartersCenter } from "@/data/headquarters";
import { cn } from "@/lib/utils";

interface CenterCardProps {
  center: HeadquartersCenter;
  variant?: "default" | "compact";
  className?: string;
  showDescription?: boolean;
  showBadge?: boolean;
  showArrow?: boolean;
}

export default function CenterCard({
  center,
  variant = "default",
  className,
  showDescription = true,
  showBadge = true,
  showArrow = true,
}: CenterCardProps) {
  const Icon = center.icon;
  const theme = centerThemes[center.accent];

  return (
    <Link
      href={`/companies/${center.company.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500",
        "bg-white/[0.03]",
        "hover:-translate-y-2",
        "hover:shadow-2xl",
        theme.border,
        theme.glow,
        variant === "default"
          ? "min-h-[360px] p-8"
          : "min-h-[280px] p-6",
        className
      )}
    >
      {/* Background Gradient */}

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          theme.background
        )}
      />

      {/* Decorative Glow */}

      <div
        className={cn(
          "absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl opacity-10 transition-opacity duration-500 group-hover:opacity-30",
          theme.background
        )}
      />

      {/* Content */}

      <div className="relative z-10 flex h-full flex-col">
        {/* Icon */}

        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl border bg-white/5 transition-transform duration-500 group-hover:scale-110",
            theme.border
          )}
        >
          <Icon
            size={30}
            className={theme.accent}
          />
        </div>

        {/* Title */}

        <h3 className="mt-8 text-2xl font-bold tracking-tight text-white">
          {center.company.name}
        </h3>

        {/* Description */}

        {showDescription && (
          <p className="mt-4 line-clamp-4 flex-1 leading-7 text-white/70">
            {center.company.hero.description}
          </p>
        )}

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between">
          {showBadge && (
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]",
                theme.border,
                theme.accent
              )}
            >
              {theme.badge}
            </span>
          )}

          {showArrow && (
            <div className="flex items-center gap-2 text-sm font-medium text-white/60 transition-all duration-300 group-hover:text-white">
              <span>Explore</span>

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}