"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    <motion.article
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.3,
      }}
      className={className}
    >
      <div
        className={`
          group
          relative
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-[32px]
          border
          p-8
          transition-all
          duration-500

          ${
            featured
              ? `
                border-[hsl(var(--accent))]/40
                bg-gradient-to-br
                from-[#102338]
                via-[#0d1d2f]
                to-[#07131f]
                shadow-[0_0_40px_rgba(11,92,171,.12)]
              `
              : `
                border-white/10
                bg-gradient-to-br
                from-[#0c1825]
                via-[#091522]
                to-[#07131f]
                hover:border-[hsl(var(--accent))]/30
              `
          }

          hover:shadow-[0_25px_60px_rgba(0,0,0,.45)]
        `}
      >
        {/* Top Accent */}

        <div
          className="
            absolute
            left-0
            top-0
            h-1
            w-full
            bg-gradient-to-r
            from-[hsl(var(--accent))]
            via-[hsl(var(--accent))]
            to-transparent
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
          "
        />

        {/* Glow */}

        <div
          className="
            absolute
            inset-0
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
            group-hover:scale-110
            bg-[radial-gradient(circle_at_top_right,rgba(11,92,171,.18),transparent_65%)]
          "
        />

        {/* Featured */}

        {featured && (
          <div
            className="
              absolute
              right-6
              top-6
              rounded-full
              bg-[hsl(var(--accent))]
              px-4
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#07131f]
            "
          >
            Featured
          </div>
        )}

        <div className="relative z-10 flex h-full flex-col">
          {/* Icon */}

          <motion.div
            whileHover={{
              rotate: 6,
              scale: 1.08,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              border
              border-[hsl(var(--accent))]/25
              bg-[hsl(var(--accent))]/10
              text-[hsl(var(--accent))]
              transition-all
              duration-300
              group-hover:bg-[hsl(var(--accent))]/15
            "
          >
            <Icon size={38} />
          </motion.div>

          {/* Title */}

          <h3
            className="
              mt-8
              text-3xl
              font-bold
              tracking-tight
              text-white
              transition-colors
              duration-300
              group-hover:text-[hsl(var(--accent))]
            "
          >
            {title}
          </h3>

          {/* Description */}

          <p
            className="
              mt-5
              flex-grow
              text-[15px]
              leading-8
              text-white/75
            "
          >
            {description}
          </p>

          {/* Divider */}

          <div
            className="
              my-8
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/10
              to-transparent
            "
          />

          {/* Tags */}

          {tags.length > 0 && (
            <div
              className="
                flex
                flex-wrap
                gap-3
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

          {/* Footer */}

          {href && (
            <Link
              href={href}
              className="
                mt-10
                inline-flex
                items-center
                gap-2
                font-semibold
                text-[hsl(var(--accent))]
                transition-all
                duration-300
                hover:gap-3
              "
            >
              Learn More

              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
        
