"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  id?: string;
}

export default function SectionContainer({
  children,
  className,
  contentClassName,
  id,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        `
          relative
          overflow-hidden
          py-24

          md:py-32

          lg:py-40
        `,
        className
      )}
    >
      <div
        className={cn(
          `
            mx-auto
            w-full
            max-w-[1320px]

            px-6

            md:px-8

            lg:px-10

            xl:px-0
          `,
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}