"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  MapPin,
} from "lucide-react";

import GlassCard from "@/components/shared/GlassCard";
import TechChip from "@/components/shared/TechChip";
import { EvantraButton } from "@/components/shared/EvantraButton";

import type { CampusCenter } from "./types";

interface CampusTooltipProps {
  center: CampusCenter;
}

export default function CampusTooltip({
  center,
}: CampusTooltipProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={center.id}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -20,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
      >
        <GlassCard
          className="
            rounded-none
            border-0
            bg-[#081521]
            p-8
            shadow-none

            lg:p-10
          "
        >
          <div
            className="
              grid
              gap-10

              lg:grid-cols-[1fr_auto]
              lg:items-center
            "
          >
            {/* ================================================= */}
            {/* Left */}
            {/* ================================================= */}

            <div>
              {/* Category */}

              <div
                className="
                  mb-4

                  flex
                  flex-wrap
                  items-center
                  gap-5

                  text-sm
                  text-white/60
                "
              >
                <div className="flex items-center gap-2">
                  <Building2 size={16} />

                  <span>{center.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} />

                  <span>{center.campusDistrict}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />

                  <span>{center.established}</span>
                </div>
              </div>

              {/* Title */}

              <h3
                className="
                  text-3xl
                  font-bold
                  tracking-tight

                  text-white
                "
              >
                {center.name}
              </h3>

              {/* Tagline */}

              <p
                className="
                  mt-2

                  text-lg
                  font-medium

                  text-[hsl(var(--accent))]
                "
              >
                {center.tagline}
              </p>

              {/* Description */}

              <p
                className="
                  mt-6

                  max-w-3xl

                  text-base
                  leading-8

                  text-white/75
                "
              >
                {center.description}
              </p>

              {/* Technologies */}

              <div
                className="
                  mt-8

                  flex
                  flex-wrap
                  gap-3
                "
              >
                {center.technologies.map((technology) => (
                  <TechChip
                    key={technology}
                    label={technology}
                  />
                ))}
              </div>
            </div>

            {/* ================================================= */}
            {/* Right */}
            {/* ================================================= */}

            <div
              className="
                flex

                items-end

                lg:justify-end
              "
            >
              <Link href={center.href}>
                <EvantraButton
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Explore Center
                </EvantraButton>
              </Link>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}