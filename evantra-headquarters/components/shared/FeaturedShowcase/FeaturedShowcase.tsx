"use client";

import { motion } from "framer-motion";

import CompanySection from "@/components/shared/CompanySection";
import SectionBadge from "@/components/shared/SectionBadge";

import DashboardPreview from "./DashboardPreview";
import HighlightCard from "./HighlightCard";
import ShowcaseActions from "./ShowcaseActions";
import ShowcaseBackground from "./ShowcaseBackground";

import {
    fadeLeft,
    fadeRight,
    showcaseContainer,
} from "@/lib/animations/featuredShowcase";

import type { FeaturedShowcaseProps } from "./types";

export default function FeaturedShowcase({
    badge,
    title,
    subtitle,
    description,

    image,

    metrics = [],
    dashboardMetrics = [],

    highlights,

    primaryAction,
    secondaryAction,

    reverse = false,
}: FeaturedShowcaseProps) {
    return (
        <CompanySection
            spacing="lg"
            background="gradient"
            className="relative overflow-hidden"
        >
            <ShowcaseBackground />

            <motion.div
                variants={showcaseContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{
                    once: true,
                    amount: 0.25,
                }}
                className={`
          relative
          z-10

          grid
          gap-20
          items-center

          lg:grid-cols-2

          ${reverse
                        ? "lg:[&>*:first-child]:order-2"
                        : ""
                    }
        `}
            >
                {/* =====================================
            LEFT
        ===================================== */}

                <motion.div
                    variants={fadeLeft}
                    className="max-w-xl"
                >
                    <SectionBadge>
                        {badge}
                    </SectionBadge>

                    <h2
                        className="
              mt-8

              text-5xl
              font-black
              leading-tight
              tracking-tight

              text-white

              xl:text-6xl
            "
                    >
                        {title}
                    </h2>

                    {subtitle && (
                        <p
                            className="
                mt-4

                text-2xl
                font-medium

                text-[hsl(var(--accent))]
              "
                        >
                            {subtitle}
                        </p>
                    )}

                    <p
                        className="
              mt-8

              text-lg
              leading-8

              text-slate-300
            "
                    >
                        {description}
                    </p>

                    <ShowcaseActions
                        primaryAction={primaryAction}
                        secondaryAction={secondaryAction}
                    />

                    {/* Hero Metrics */}

                    {metrics.length > 0 && (
                        <div
                            className="
                mt-12

                grid
                grid-cols-2

                gap-6
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
                      tracking-[0.18em]
                      text-white/55
                    "
                                    >
                                        {metric.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Highlight Cards */}

                    <div
                        className="
              mt-14

              grid
              gap-5

              sm:grid-cols-2
            "
                    >
                        {highlights.map((item) => (
                            <HighlightCard
                                key={item.title}
                                title={item.title}
                                description={item.description}
                                icon={item.icon}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* =====================================
            RIGHT
        ===================================== */}

                <motion.div variants={fadeRight}>
                    <DashboardPreview
                        title={title}
                        image={image}
                        alt={title}
                        metrics={dashboardMetrics}
                    />
                </motion.div>
            </motion.div>
        </CompanySection>
    );
}