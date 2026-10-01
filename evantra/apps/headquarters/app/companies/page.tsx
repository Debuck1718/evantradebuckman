import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { GlobalHeader, GlobalFooter } from "@/components/layout";
import { companiesData } from "@/components/home/companies/companiesData";

export const metadata: Metadata = {
  title: "Companies & Centers",
  description:
    "Explore the Evantra centers of excellence across software, cybersecurity, engineering, artificial intelligence, innovation and global commerce.",
};

export default function CompaniesPage() {
  return (
    <>
      <GlobalHeader />

      <main
        id="main-content"
        className="relative overflow-hidden bg-white"
      >
        <section className="relative overflow-hidden bg-[#071522] px-6 pb-20 pt-36 text-white md:px-10 md:pb-24 md:pt-44">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(230,178,74,0.14),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(36,91,125,0.18),transparent_35%)]" />

          <div className="relative mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/5 px-5 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e6b24a]" />

              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#e6b24a]">
                The Evantra Campus
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-7xl">
              Engineering excellence
              <br />
              <span className="text-[#e6b24a]">
                across every discipline.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/65 md:text-xl md:leading-9">
              Each Evantra center focuses on a specialized discipline while
              collaborating across the campus to turn research, engineering
              and innovation into technology that serves people.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            {companiesData.map((center) => (
              <article
                key={center.id}
                className="group flex flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,.06)] transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={center.heroImage}
                    alt={center.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ev-gold">
                    {center.category}
                  </p>

                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                    {center.name}
                  </h2>

                  <div className="mt-4 flex items-center gap-2 text-slate-500">
                    <MapPin className="h-5 w-5 text-ev-gold" />
                    <span>{center.campusLocation}</span>
                  </div>

                  <p className="mt-6 flex-1 leading-8 text-slate-600">
                    {center.description}
                  </p>

                  <Link
                    href={center.href}
                    className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#071522] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#101f30]"
                  >
                    Enter Center
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}
