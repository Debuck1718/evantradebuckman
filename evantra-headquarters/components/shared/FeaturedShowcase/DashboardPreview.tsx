"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";

import BrowserFrame from "./BrowserFrame";
import FloatingMetric from "./FloatingMetric";

interface DashboardMetric {
  label: string;

  value: string;

  icon?: LucideIcon;

  position: string;
}

interface DashboardPreviewProps {
  image: string;

  alt: string;

  url?: string;

  title?: string;

  toolbar?: React.ReactNode;

  metrics?: DashboardMetric[];

  className?: string;
}

export default function DashboardPreview({
  image,
  alt,
  url,
  title,
  toolbar,
  metrics = [],
  className,
}: DashboardPreviewProps) {
  return (
    <div
      className={`
        relative
        w-full
        ${className ?? ""}
      `}
    >
      {/* Floating Metrics */}

      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <FloatingMetric
            key={metric.label}
            label={metric.label}
            value={metric.value}
            icon={
              Icon ? <Icon size={20} /> : undefined
            }
            className={metric.position}
          />
        );
      })}

      <BrowserFrame
        url={url}
        title={title}
        toolbar={toolbar}
      >
        <div
          className="
            relative
            aspect-[16/10]
            overflow-hidden
            bg-[#07131f]
          "
        >
          <Image
            src={image}
            alt={alt}
            fill
            priority
            className="
              object-cover
              object-top
            "
          />

          {/* Top Reflection */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0

              bg-gradient-to-b
              from-white/10
              via-transparent
              to-transparent
            "
          />

          {/* Bottom Fade */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0

              bg-gradient-to-t
              from-[#07131f]/30
              via-transparent
              to-transparent
            "
          />

          {/* Accent Glow */}

          <div
            className="
              pointer-events-none

              absolute

              inset-x-0
              bottom-0

              h-40

              bg-gradient-to-t
              from-[hsl(var(--accent))]/10
              to-transparent
            "
          />
        </div>
      </BrowserFrame>
    </div>
  );
}