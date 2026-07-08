"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import GlassCard from "./GlassCard";
import TechChip from "./TechChip";

interface FeatureCardProps {
  title: string;

  description: string;

  icon: LucideIcon;

  tags?: string[];

  href?: string;

  featured?: boolean;

  className?: string;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  tags = [],
  href,
  featured = false,
  className = "",
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
      }}
      className={className}
    >
      <GlassCard
        className={`
          group

          relative

          flex

          h-full

          flex-col

          overflow-hidden

          p-8

          transition-all
          duration-500

          ${
            featured
              ? "ring-1 ring-[hsl(var(--accent))]/25"
              : ""
          }
        `}
      >
        {/* ================================================= */}
        {/* Glow */}
        {/* ================================================= */}

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            opacity-0

            transition-opacity
            duration-500

            group-hover:opacity-100

            bg-[radial-gradient(circle_at_top_right,rgba(11,92,171,.14),transparent_60%)]
          "
        />

        {/* ================================================= */}
        {/* Icon */}
        {/* ================================================= */}

        <motion.div
          whileHover={{
            rotate: 8,
            scale: 1.08,
          }}
          className="
            relative

            flex

            h-16
            w-16

            items-center
            justify-center

            rounded-2xl

            border

            border-[hsl(var(--accent))]/25

            bg-[hsl(var(--accent))]/10

            text-[hsl(var(--accent))]
          "
        >
          <Icon size={30} />
        </motion.div>

        {/* ================================================= */}
        {/* Title */}
        {/* ================================================= */}

        <h3
          className="
            mt-8

            text-2xl

            font-bold

            text-white
          "
        >
          {title}
        </h3>

        {/* ================================================= */}
        {/* Description */}
        {/* ================================================= */}

        <p
          className="
            mt-5

            flex-grow

            leading-8

            text-white/70
          "
        >
          {description}
        </p>

        {/* ================================================= */}
        {/* Tags */}
        {/* ================================================= */}

        {tags.length > 0 && (
          <div
            className="
              mt-8

              flex

              flex-wrap

              gap-2
            "
          >
            {tags.map((tag) => (
              <TechChip
                key={tag}
                label={tag}
              />
            ))}
          </div>
        )}

        {/* ================================================= */}
        {/* Footer */}
        {/* ================================================= */}

        {href && (
          <Link
            href={href}
            className="
              mt-10

              inline-flex

              items-center

              font-semibold

              text-[hsl(var(--accent))]

              transition-all

              group-hover:translate-x-1
            "
          >
            Learn More

            <ArrowRight
              className="
                ml-2

                h-4
                w-4
              "
            />
          </Link>
        )}
      </GlassCard>
    </motion.div>
  );
}
        
