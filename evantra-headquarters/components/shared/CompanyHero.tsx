"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type {
  CompanyAction,
  CompanyMetric,
} from "@/data/companies";

import { EvantraButton } from "@/components/shared/EvantraButton";

interface CompanyHeroProps {
  badge: string;
  title: string;
  description: string;
  image: string;

  primaryAction?: CompanyAction;
  secondaryAction?: CompanyAction;

  metrics?: CompanyMetric[];

  theme?:
    | "software"
    | "ai"
    | "engineering"
    | "cybersecurity"
    | "commerce"
    | "innovation";

  showMetrics?: boolean;

  animatedGrid?: boolean;

  showParticles?: boolean;

  glassIntensity?: "low" | "medium" | "high";
}

const themeOverlay = {
  software:
    "from-[#07131f]/95 via-[#081d36]/82 to-[#0b2d56]/60",

  ai:
    "from-[#15052d]/95 via-[#28124f]/82 to-[#5b21b6]/60",

  engineering:
    "from-[#032b2a]/95 via-[#0f766e]/82 to-[#14b8a6]/60",

  cybersecurity:
    "from-[#031c16]/95 via-[#065f46]/82 to-[#10b981]/60",

  commerce:
    "from-[#2d1d02]/95 via-[#5a4108]/82 to-[#d4af37]/45",

  innovation:
    "from-[#2b1203]/95 via-[#9a3412]/82 to-[#fb923c]/55",
};

const glass = {
  low:
    "bg-white/5 backdrop-blur-md",

  medium:
    "bg-white/10 backdrop-blur-xl",

  high:
    "bg-white/15 backdrop-blur-3xl",
};

export default function CompanyHero({
  badge,
  title,
  description,
  image,

  primaryAction,
  secondaryAction,

  metrics = [],

  theme = "software",

  showMetrics = true,

  animatedGrid = false,

  showParticles = false,

  glassIntensity = "medium",
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

      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0"
      >
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Theme Overlay */}

      <div
        className={`
          absolute
          inset-0

          bg-gradient-to-r

          ${themeOverlay[theme]}
        `}
      />

      {/* Digital Grid */}

      {animatedGrid && (
        <div
          className="
            absolute
            inset-0

            opacity-[0.08]

            [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)]

            [background-size:48px_48px]

            animate-pulse
          "
        />
      )}

      {/* Particles Placeholder */}

      {showParticles && (
        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.08),transparent_20%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,.06),transparent_18%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,.05),transparent_20%)]

            pointer-events-none
          "
        />
      )}

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

          py-40
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className={`
            max-w-4xl

            rounded-[32px]

            border

            border-white/10

            ${glass[glassIntensity]}

            p-8

            md:p-12
          `}
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

              tracking-[0.2em]

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

              leading-[1.05]

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

              max-w-3xl

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

                gap-4
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

          {showMetrics && metrics.length > 0 && (
            <div
              className="
                mt-16

                grid

                grid-cols-2

                gap-8

                border-t

                border-white/10

                pt-10

                md:grid-cols-4
              "
            >
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                >
                  <h3
                    className="
                      text-4xl

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

                      tracking-[0.18em]

                      text-white/60
                    "
                  >
                    {metric.label}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}