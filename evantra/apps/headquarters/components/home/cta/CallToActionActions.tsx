"use client";

import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { EvantraButton } from "@/components/shared/EvantraButton";

export default function CallToActionActions() {
  return (
    <div
      className="
        mt-12
        flex
        flex-col
        justify-center
        gap-5

        sm:flex-row
      "
    >
      <Link href="/contact">
        <EvantraButton
          size="xl"
          rightIcon={<ArrowRight size={20} />}
        >
          Start a Conversation
        </EvantraButton>
      </Link>

      <Link href="/companies">
        <EvantraButton
          variant="glass"
          size="xl"
          leftIcon={<Building2 size={20} />}
        >
          Explore Companies
        </EvantraButton>
      </Link>
    </div>
  );
}