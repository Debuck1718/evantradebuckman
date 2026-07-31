"use client";

import { ArrowRight } from "lucide-react";

import { EvantraButton } from "@/components/shared/EvantraButton";

export default function FooterNewsletter() {
  return (
    <div
      className="
        rounded-[32px]

        border

        border-white/10

        bg-white/5

        p-8

        backdrop-blur-xl
      "
    >
      <p
        className="
          text-sm

          font-semibold

          uppercase

          tracking-[0.2em]

          text-ev-gold
        "
      >
        Stay Connected
      </p>

      <h3
        className="
          mt-4

          text-3xl

          font-bold

          text-white
        "
      >
        Join the Evantra Community
      </h3>

      <p
        className="
          mt-4

          leading-8

          text-white/70
        "
      >
        Receive updates on innovation,
        research, technology and the
        Evantra ecosystem.
      </p>

      <input
        type="email"
        placeholder="Email address"
        className="
          mt-8

          h-14
          w-full

          rounded-full

          border

          border-white/10

          bg-white/5

          px-6

          text-white

          outline-none

          placeholder:text-white/40
        "
      />

      <div className="mt-6">
        <EvantraButton
          className="w-full"
          rightIcon={<ArrowRight size={18} />}
        >
          Subscribe
        </EvantraButton>
      </div>
    </div>
  );
}