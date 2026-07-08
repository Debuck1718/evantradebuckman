"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { EvantraButton } from "@/components/shared/EvantraButton";

export interface CompanyHeroMetric {
  label: string;
  value: string;
}

interface CompanyHeroProps {
  badge: string;

  title: string;

  description: string;

  image: string;

  primaryAction?: {
    label: string;
    href: string;
  };

  secondaryAction?: {
    label: string;
    href: string;
  };

  metrics?: CompanyHeroMetric[];
}

export default function CompanyHero({
  badge,
  title,
  description,
  image,
  primaryAction,
  secondaryAction,
  metrics = [],
}: CompanyHeroProps) {
  return (
    <section
      className="
        relative

        flex

        min-h-screen

        items-center

        overflow-hidden
      "
    >
      {/* Background */}

      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="
          object-cover

          scale-[1.02]
        "
      />

      {/* Overlay */}

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-r

          from-[#07131f]/92

          via-[#07131f]/78

          to-[#07131f]/55
        "
      />

      {/* Content */}

      <div
        className="
          relative

          z-10

          mx-auto

          flex

          w-full

          max-w-7xl

          px-6

          py-36
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="max-w-3xl"
        >
          {/* Badge */}

          <span
            className="
              inline-flex

              rounded-full

              border

              border-[hsl(var(--accent))]/30

              bg-[hsl(var(--accent))]/10

              px-5
              py-2

              text-sm

              font-semibold

              uppercase

              tracking-[0.18em]

              text-[hsl(var(--accent))]
            "
          >
            {badge}
          </span>

          {/* Title */}

          <h1
            className="
              mt-8

              text-5xl

              font-bold

              leading-tight

              text-white

              md:text-6xl

              xl:text-7xl
            "
          >
            {title}
          </h1>

          {/* Description */}

          <p
            className="
              mt-8

              max-w-2xl

              text-xl

              leading-9

              text-white/75
            "
          >
            {description}
          </p>

          {/* Actions */}

          {(primaryAction || secondaryAction) && (
            <div
              className="
                mt-12

                flex

                flex-wrap

                gap-5
              "
            >
              {primaryAction && (
                <Link href={primaryAction.href}>
                  <EvantraButton
                    size="lg"
                    rightIcon={<ArrowRight size={18} />}
                  >
                    {primaryAction.label}
                  </EvantraButton>
                </Link>
              )}

              {secondaryAction && (
                <Link href={secondaryAction.href}>
                  <EvantraButton
                    variant="outline"
                    size="lg"
                  >
                    {secondaryAction.label}
                  </EvantraButton>
                </Link>
              )}
            </div>
          )}

          {/* Metrics */}

          {metrics.length > 0 && (
            <div
              className="
                mt-16

                grid

                grid-cols-2

                gap-8

                md:grid-cols-4
              "
            >
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <h3
                    className="
                      text-3xl

                      font-bold

                      text-white
                    "
                  >
                    {metric.value}
                  </h3>

                  <p
                    className="
                      mt-2

                      text-sm

                      uppercase

                      tracking-wider

                      text-white/60
                    "
                  >
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}