"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import type { CampusCenter } from "./companiesData";
import { EvantraButton } from "@/components/shared/EvantraButton";
import { cn } from "@/lib/utils";

interface FeaturedCompanyCardProps {
  center: CampusCenter;
  index: number;
}

export default function FeaturedCompanyCard({
  center,
  index,
}: FeaturedCompanyCardProps) {
  const reverse = index % 2 === 1;

  return (
    <article
      className="
        group
        overflow-hidden

        rounded-[42px]

        border
        border-slate-200

        bg-white

        shadow-[0_30px_100px_rgba(15,23,42,.08)]

        transition-all
        duration-500
      "
    >
      <div
        className={cn(
          `
            grid
            items-center

            lg:grid-cols-2
          `,
          reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        {/* ================================================= */}
        {/* Campus Image */}
        {/* ================================================= */}

        <div className="relative overflow-hidden">
          <div className="relative aspect-[16/10]">
            <Image
              src={center.heroImage}
              alt={center.imageAlt}
              fill
              priority={index < 2}
              className="
                object-cover

                transition-transform
                duration-700

                group-hover:scale-105
              "
            />

            {/* Overlay */}

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-t

                from-slate-950/35

                via-transparent

                to-transparent
              "
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* Center Information */}
        {/* ================================================= */}

        <div
          className="
            flex
            flex-col

            justify-center

            p-8

            md:p-12

            xl:p-16
          "
        >
          {/* Category */}

          <p
            className="
              text-sm

              font-semibold

              uppercase

              tracking-[0.24em]

              text-ev-gold
            "
          >
            {center.category}
          </p>

          {/* Title */}

          <h3
            className="
              mt-5

              text-4xl

              font-bold

              tracking-tight

              text-slate-900
            "
          >
            {center.name}
          </h3>

          {/* Campus Location */}

          <div
            className="
              mt-5

              flex
              items-center

              gap-2

              text-slate-500
            "
          >
            <MapPin className="h-5 w-5 text-ev-gold" />

            <span>{center.campusLocation}</span>
          </div>

          {/* Tagline */}

          <p
            className="
              mt-8

              text-2xl

              font-semibold

              leading-snug

              text-slate-800
            "
          >
            {center.tagline}
          </p>

          {/* Description */}

          <p
            className="
              mt-6

              max-w-2xl

              text-lg

              leading-8

              text-slate-600
            "
          >
            {center.description}
          </p>

          {/* Technologies */}

          <div
            className="
              mt-10

              flex
              flex-wrap

              gap-3
            "
          >
            {center.technologies.map((technology) => (
              <span
                key={technology}
                className="
                  rounded-full

                  border
                  border-ev-gold/30

                  bg-ev-gold-soft

                  px-4
                  py-2

                  text-sm
                  font-medium

                  text-ev-gold
                "
              >
                {technology}
              </span>
            ))}
          </div>

          {/* CTA */}

          <div className="mt-12">
            <Link href={center.href}>
              <EvantraButton
                size="lg"
                rightIcon={<ArrowRight size={18} />}
              >
                Enter Center
              </EvantraButton>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}