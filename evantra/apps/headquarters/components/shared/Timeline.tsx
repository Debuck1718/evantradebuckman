"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

import GlassCard from "./GlassCard";

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function Timeline({
  items,
  className = "",
}: TimelineProps) {
  return (
    <div
      className={`
        relative

        space-y-8

        ${className}
      `}
    >
      {items.map((item, index) => (
        <motion.div
          key={`${item.year}-${item.title}`}
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            delay: index * 0.08,
            duration: 0.45,
          }}
        >
          <GlassCard
            className="
              group

              relative

              overflow-hidden

              p-8

              transition-all
              duration-500
            "
          >
            {/* Accent */}

            <div
              className="
                absolute

                left-0
                top-0

                h-full
                w-1

                bg-[hsl(var(--accent))]
              "
            />

            {/* Glow */}

            <div
              className="
                absolute
                inset-0

                opacity-0

                transition-opacity
                duration-500

                group-hover:opacity-100

                bg-[radial-gradient(circle_at_top_right,rgba(11,92,171,.12),transparent_65%)]
              "
            />

            <div className="relative z-10">

              <div
                className="
                  flex

                  items-center

                  gap-3
                "
              >
                <CalendarDays
                  className="
                    h-5
                    w-5

                    text-[hsl(var(--accent))]
                  "
                />

                <span
                  className="
                    text-sm

                    font-semibold

                    uppercase

                    tracking-[0.2em]

                    text-[hsl(var(--accent))]
                  "
                >
                  {item.year}
                </span>
              </div>

              <h3
                className="
                  mt-5

                  text-2xl

                  font-bold

                  text-white
                "
              >
                {item.title}
              </h3>

              <p
                className="
                  mt-4

                  leading-8

                  text-white/70
                "
              >
                {item.description}
              </p>

            </div>

          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}