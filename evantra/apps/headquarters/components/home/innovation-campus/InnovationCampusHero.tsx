"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import Reveal from "@/components/shared/Reveal";
import SectionBadge from "@/components/shared/SectionBadge";
import { EvantraButton } from "@/components/shared/EvantraButton";

export default function InnovationCampusHero() {
  return (
    <div>
      {/* Header */}

      <div className="mx-auto max-w-4xl text-center">

        <Reveal>
          <div className="flex justify-center">
            <SectionBadge>
              INNOVATION CAMPUS
            </SectionBadge>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="
              mt-8

              text-5xl
              font-bold
              tracking-tight

              text-slate-900

              md:text-6xl
            "
          >
            Where Vision
            <br />

            <span className="text-ev-gold-gradient">
              Becomes Reality
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p
            className="
              mx-auto
              mt-8

              max-w-3xl

              text-xl
              leading-9

              text-slate-600
            "
          >
            The Evantra Headquarters is more than an office.
            It is an innovation campus where engineering,
            research, artificial intelligence, cybersecurity
            and global collaboration come together to create
            technologies that improve lives.
          </p>
        </Reveal>
      </div>

      {/* Campus Image */}

      <Reveal delay={0.25}>
        <div
          className="
            group
            relative

            mt-20

            overflow-hidden

            rounded-[40px]

            shadow-[0_40px_120px_rgba(15,23,42,.15)]
          "
        >
          <Image
            src="/images/hero/headquarters-campus.webp"
            alt="Evantra Headquarters Innovation Campus"
            width={1800}
            height={1100}
            priority
            className="
              h-auto
              w-full

              object-cover

              transition-transform
              duration-1000

              group-hover:scale-[1.03]
            "
          />

          {/* Image Gradient */}

          <div
            className="
              absolute
              inset-0

              bg-gradient-to-t

              from-[#06131F]/80

              via-transparent

              to-transparent
            "
          />

          {/* Floating Campus Panel */}

          <div
            className="
              absolute

              left-10
              bottom-10

              max-w-md

              rounded-[28px]

              border
              border-white/15

              bg-white/10

              p-8

              text-white

              backdrop-blur-2xl
            "
          >
            <p
              className="
                text-xs

                font-semibold

                uppercase

                tracking-[0.22em]

                text-ev-gold
              "
            >
              Headquarters
            </p>

            <h3
              className="
                mt-4

                text-3xl

                font-bold
              "
            >
              Evantra Innovation Campus
            </h3>

            <p
              className="
                mt-4

                text-white/80

                leading-7
              "
            >
              Purpose-built to accelerate engineering,
              innovation and technology leadership for
              Africa and the world.
            </p>

            <div className="mt-8">

              <EvantraButton
                rightIcon={<ArrowUpRight size={18} />}
              >
                Explore Campus
              </EvantraButton>

            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}