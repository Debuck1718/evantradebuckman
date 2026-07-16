"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EvantraButton } from "@/components/shared/EvantraButton";

interface Action {
  label: string;
  href: string;
}

interface ShowcaseActionsProps {
  primaryAction?: Action;

  secondaryAction?: Action;
}

export default function ShowcaseActions({
  primaryAction,
  secondaryAction,
}: ShowcaseActionsProps) {
  if (!primaryAction && !secondaryAction) {
    return null;
  }

  return (
    <div
      className="
        mt-10
        flex
        flex-wrap
        items-center
        gap-4
      "
    >
      {primaryAction && (
        <EvantraButton>
          <Link href={primaryAction.href}>
            {primaryAction.label}
          </Link>
        </EvantraButton>
      )}

      {secondaryAction && (
        <Link
          href={secondaryAction.href}
          className="
            inline-flex
            items-center
            gap-2

            rounded-full

            border
            border-white/10

            px-6
            py-3

            font-medium
            text-white/80

            transition-all
            duration-300

            hover:border-[hsl(var(--accent))]/40
            hover:text-white
            hover:gap-3
          "
        >
          {secondaryAction.label}

          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}