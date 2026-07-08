"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Evantra Home"
      className="
        group
        flex
        items-center
        transition-transform
        duration-300
        hover:scale-[1.02]
      "
    >
      <Image
        src="/images/brand/logos/evantra-logo-primary.png"
        alt="Evantra De-Buckman Ventures"
        width={420}
        height={96}
        priority
        className="
          h-10
          w-auto
          object-contain

          sm:h-11
          md:h-12
          lg:h-14
        "
      />
    </Link>
  );
}