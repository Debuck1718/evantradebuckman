"use client";

import {
  BrainCircuit,
  Building2,
  Cpu,
  FlaskConical,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import GlassCard from "@/components/shared/GlassCard";
import Reveal from "@/components/shared/Reveal";

const facilities = [
  {
    icon: BrainCircuit,
    label: "AI Research Center",
  },
  {
    icon: Cpu,
    label: "Engineering Hub",
  },
  {
    icon: ShieldCheck,
    label: "Cybersecurity Operations",
  },
  {
    icon: FlaskConical,
    label: "Innovation Laboratory",
  },
];

export default function HeroCampusCard() {
  return (
    <Reveal
      direction="left"
      delay={0.85}
    >
      <GlassCard
        hover={false}
        variant="default"
        className="
          w-[340px]
          border-white/15
          bg-white/10
          backdrop-blur-2xl
        "
      >
        {/* Header */}

        <div className="flex items-start justify-between">

          <div>

            <div className="flex items-center gap-2">

              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

              <span
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-emerald-300
                "
              >
                Live Vision
              </span>

            </div>

            <h3
              className="
                mt-4
                text-2xl
                font-bold
                text-white
              "
            >
              Evantra
            </h3>

            <p
              className="
                text-white/70
                text-sm
                mt-1
              "
            >
              Innovation Campus
            </p>

          </div>

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center

              rounded-2xl

              bg-[hsl(var(--accent))/0.15]
            "
          >
            <Building2
              className="
                h-7
                w-7

                text-[hsl(var(--accent))]
              "
            />
          </div>

        </div>

        {/* Divider */}

        <div
          className="
            my-7
            h-px
            bg-white/10
          "
        />

        {/* Facilities */}

        <div className="space-y-4">

          {facilities.map((facility) => {
            const Icon = facility.icon;

            return (
              <div
                key={facility.label}
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center

                    rounded-xl

                    bg-white/10
                  "
                >
                  <Icon
                    className="
                      h-5
                      w-5

                      text-[hsl(var(--accent))]
                    "
                  />
                </div>

                <span
                  className="
                    text-sm
                    text-white/80
                  "
                >
                  {facility.label}
                </span>

              </div>
            );
          })}

        </div>

        {/* Footer */}

        <div
          className="
            mt-8

            flex

            items-center

            justify-between

            border-t

            border-white/10

            pt-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <MapPin
              className="
                h-4
                w-4

                text-[hsl(var(--accent))]
              "
            />

            <span
              className="
                text-xs
                text-white/60
              "
            >
              Accra • Ghana
            </span>

          </div>

          <span
            className="
              text-[10px]

              uppercase

              tracking-[0.18em]

              text-white/40
            "
          >
            Masterplan
          </span>

        </div>
      </GlassCard>
    </Reveal>
  );
}