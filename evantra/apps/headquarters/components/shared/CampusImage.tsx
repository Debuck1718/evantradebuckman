"use client";

import Image from "next/image";

interface CampusImageProps {
  src: string;
  alt: string;

  priority?: boolean;

  aspectRatio?: "16:9" | "4:3" | "1:1";

  className?: string;

  overlay?: boolean;

  rounded?: boolean;

  children?: React.ReactNode;
}

export default function CampusImage({
  src,
  alt,
  priority = false,
  aspectRatio = "16:9",
  className = "",
  overlay = true,
  rounded = true,
  children,
}: CampusImageProps) {
  const ratioClass =
    aspectRatio === "16:9"
      ? "aspect-[16/9]"
      : aspectRatio === "4:3"
      ? "aspect-[4/3]"
      : "aspect-square";

  return (
    <div
      className={`
        relative

        w-full

        overflow-hidden

        ${
          rounded
            ? "rounded-3xl"
            : ""
        }

        ${ratioClass}

        ${className}
      `}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="
          (max-width:768px) 100vw,
          (max-width:1280px) 90vw,
          1440px
        "
        className="
          object-cover

          transition-transform
          duration-700

          hover:scale-[1.015]
        "
      />

      {overlay && (
        <>
          {/* Top Gradient */}

          <div
            className="
              pointer-events-none

              absolute
              inset-0

              bg-gradient-to-b

              from-slate-950/20

              via-transparent

              to-slate-950/30
            "
          />

          {/* Soft Campus Glow */}

          <div
            className="
              pointer-events-none

              absolute
              inset-0

              bg-[radial-gradient(circle_at_center,transparent_45%,rgba(2,6,23,.18)_100%)]
            "
          />
        </>
      )}

      {children}
    </div>
  );
}