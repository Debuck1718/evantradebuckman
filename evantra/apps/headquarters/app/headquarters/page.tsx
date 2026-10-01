import type { Metadata } from "next";
import Link from "next/link";

import { GlobalHeader, GlobalFooter } from "@/components/layout";

export const metadata: Metadata = {
  title: "Headquarters",
  description:
    "Visit the Evantra Headquarters and the centers of excellence that make up the Evantra Innovation Campus.",
};

export default function HeadquartersPage() {
  return (
    <>
      <GlobalHeader />

      <main
        id="main-content"
        className="relative overflow-hidden bg-[#071522]"
      >
        <section className="relative px-6 pb-24 pt-36 text-white md:px-10 md:pb-32 md:pt-44">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(230,178,74,0.14),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(36,91,125,0.18),transparent_35%)]" />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/5 px-5 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e6b24a]" />

              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#e6b24a]">
                Evantra Headquarters
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-7xl">
              One campus.
              <br />
              <span className="text-[#e6b24a]">
                Every discipline.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/65 md:text-xl md:leading-9">
              The Evantra Headquarters brings together our centers of
              excellence, products, research and innovation to solve
              meaningful global challenges through technology.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href="/companies"
                className="rounded-full bg-[#e6b24a] px-7 py-4 text-sm font-semibold text-[#071522] transition hover:bg-[#f0c565]"
              >
                Explore all centers
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 px-7 py-4 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}
