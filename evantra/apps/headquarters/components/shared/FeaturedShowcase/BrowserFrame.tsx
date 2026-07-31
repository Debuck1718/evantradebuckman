"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

import Surface from "@/components/shared/Surface";
import { dashboardHover } from "@/lib/animations/featuredShowcase";

interface BrowserFrameProps {
  children: ReactNode;

  url?: string;

  title?: string;

  toolbar?: ReactNode;

  className?: string;
}

export default function BrowserFrame({
  children,
  url = "evantra.com",
  title,
  toolbar,
  className,
}: BrowserFrameProps) {
  return (
    <motion.div
      {...dashboardHover}
      style={{
        perspective: 1400,
        transformStyle: "preserve-3d",
      }}
    >
      <Surface
        variant="solid"
        rounded="3xl"
        padding="none"
        glow
        className={clsx(
          "overflow-hidden",
          className
        )}
      >
        {/* Browser Header */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-6

            border-b
            border-white/10

            bg-white/[0.03]

            px-6
            py-4
          "
        >
          {/* Left */}

          <div className="flex items-center gap-5">
            {/* Traffic Lights */}

            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400 shadow-sm" />

              <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-sm" />

              <span className="h-3 w-3 rounded-full bg-green-400 shadow-sm" />
            </div>

            {/* Title */}

            {title && (
              <span
                className="
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {title}
              </span>
            )}
          </div>

          {/* Address */}

          <div
            className="
              flex-1
              max-w-md

              rounded-full

              border
              border-white/10

              bg-black/20

              px-4
              py-2

              text-center
              text-sm
              text-white/60
            "
          >
            {url}
          </div>

          {/* Toolbar */}

          <div
            className="
              flex
              items-center
              gap-3
              min-w-[120px]
              justify-end
            "
          >
            {toolbar}
          </div>
        </div>

        {/* Browser Body */}

        <div className="relative">
          {children}
        </div>
      </Surface>
    </motion.div>
  );
}