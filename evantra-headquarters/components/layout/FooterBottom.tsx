"use client";

export default function FooterBottom() {
  return (
    <div
      className="
        mt-20

        flex

        flex-col

        items-center

        justify-between

        gap-6

        border-t

        border-white/10

        pt-8

        text-sm

        text-white/50

        md:flex-row
      "
    >
      <p>
        © {new Date().getFullYear()} Evantra De-Buckman Ventures.
        All rights reserved.
      </p>

      <p>
        Built in Ghana. Engineered for the World.
      </p>
    </div>
  );
}