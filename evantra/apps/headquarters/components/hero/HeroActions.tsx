"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { EvantraButton } from "@/components/shared/EvantraButton";
import Reveal from "@/components/shared/Reveal";

export default function HeroActions() {
  return (
    <Reveal
      delay={0.35}
      direction="up"
    >
      <div
        className="
          mt-12
          flex
          flex-col
          gap-5

          sm:flex-row
          sm:items-center
        "
      >
        {/* Primary Button */}

        <Link href="/about" className="inline-flex">
          <EvantraButton
            size="lg"
            rightIcon={<ArrowRight className="h-5 w-5" />}
            className="
              min-w-[240px]
              justify-center
            "
          >
            Explore Evantra
          </EvantraButton>
        </Link>

        {/* Secondary Button */}

        <Link href="/vision" className="inline-flex">
          <EvantraButton
            size="lg"
            variant="glass"
            leftIcon={<Compass className="h-5 w-5" />}
            className="
              min-w-[220px]
              justify-center
            "
          >
            Our Vision
          </EvantraButton>
        </Link>
      </div>
    </Reveal>
  );
}