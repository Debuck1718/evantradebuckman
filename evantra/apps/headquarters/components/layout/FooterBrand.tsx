"use client";

import Image from "next/image";
import Link from "next/link";

export default function FooterBrand() {
  return (
    <div className="max-w-md">
      <Link
        href="/"
        className="inline-flex"
      >
        <Image
          src="/images/brand/logos/evantra-logo-primary.png"
          alt="Evantra"
          width={220}
          height={60}
          priority
        />
      </Link>

      <p
        className="
          mt-8

          text-lg

          leading-8

          text-white/70
        "
      >
        Evantra is building a new generation of engineering,
        artificial intelligence, cybersecurity and innovation
        companies committed to creating technology that serves
        people.
      </p>

      <div
        className="
          mt-10

          flex

          gap-4
        "
      >
        <span
          className="
            rounded-full

            border

            border-ev-gold

            px-4

            py-2

            text-sm

            text-ev-gold
          "
        >
          Engineering
        </span>

        <span
          className="
            rounded-full

            border

            border-ev-gold

            px-4

            py-2

            text-sm

            text-ev-gold
          "
        >
          Innovation
        </span>

        <span
          className="
            rounded-full

            border

            border-ev-gold

            px-4

            py-2

            text-sm

            text-ev-gold
          "
        >
          Research
        </span>
      </div>
    </div>
  );
}