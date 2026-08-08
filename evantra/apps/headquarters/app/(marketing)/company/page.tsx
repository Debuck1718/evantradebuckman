import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Code2,
  Globe2,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

import {
  GlobalHeader,
  GlobalFooter,
} from "@/components/layout";

export const metadata: Metadata = {
  title: "Companies & Centers | Evantra",
  description:
    "Explore the six specialized Evantra centers building enterprise software, artificial intelligence, cybersecurity, engineering systems, research technologies and global commerce infrastructure.",
};

const centers = [
  {
    number: "01",
    eyebrow: "Intelligent Systems",
    title: "Artificial Intelligence",
    description:
      "Building intelligent systems that enhance decision-making, productivity and human capability through responsible artificial intelligence.",
    href: "/companies/artificial-intelligence",
    icon: BrainCircuit,
  },
  {
    number: "02",
    eyebrow: "Global Commerce",
    title: "Commerce",
    description:
      "Engineering commerce platforms, payment infrastructure, marketplaces and digital business systems for the modern economy.",
    href: "/companies/commerce",
    icon: Globe2,
  },
  {
    number: "03",
    eyebrow: "Engineering Systems",
    title: "Engineering",
    description:
      "Designing connected technologies, intelligent infrastructure and engineering systems that turn complex challenges into practical solutions.",
    href: "/companies/engineering",
    icon: Building2,
  },
  {
    number: "04",
    eyebrow: "Future Technologies",
    title: "Research & Innovation",
    description:
      "Advancing knowledge and transforming emerging technologies into practical products, services and new possibilities.",
    href: "/companies/innovation",
    icon: FlaskConical,
  },
  {
    number: "05",
    eyebrow: "Digital Infrastructure",
    title: "Software Engineering",
    description:
      "Building enterprise software, cloud platforms, automation and digital infrastructure engineered for reliability, scale and impact.",
    href: "/companies/software",
    icon: Code2,
  },
  {
    number: "06",
    eyebrow: "Security & Trust",
    title: "Cybersecurity",
    description:
      "Protecting digital infrastructure through modern security architecture, resilience, privacy and responsible security engineering.",
    href: "/companies/cybersecurity",
    icon: ShieldCheck,
  },
];

export default function CompanyPage() {
  return (
    <>
      <GlobalHeader />

      <main
        id="main-content"
        className="overflow-hidden bg-white text-[#10182c]"
      >
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative px-6 pb-20 pt-32 sm:px-10 lg:px-16 lg:pb-28 lg:pt-40">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#e6b24a]/40 bg-[#e6b24a]/5 px-5 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e6b24a]" />

                <span className="text-xs font-medium uppercase tracking-[0.28em] text-[#d99e20]">
                  Evantra Business Ecosystem
                </span>
              </div>

              <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
                Building the
                <br />
                <span className="text-[#e6b24a]">
                  Future Across Industries.
                </span>
              </h1>

              <div className="mt-10 h-1 w-24 bg-[#e6b24a]" />

              <p className="mt-9 max-w-3xl text-lg leading-8 text-[#53627b] sm:text-xl">
                Evantra brings together specialized companies and
                technology centers working across software,
                artificial intelligence, cybersecurity, engineering,
                research and global commerce.
              </p>

              <p className="mt-5 max-w-3xl text-base leading-7 text-[#53627b]">
                Each center exists for a specific purpose, but together
                they form one ecosystem designed to engineer technology
                that serves people, strengthens businesses and creates
                lasting impact.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            WHY THE CENTERS EXIST
        ====================================================== */}

        <section className="border-y border-[#10182c]/10 bg-[#f8f9fb] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#d99e20]">
                One Ecosystem
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Six centers.
                <br />
                <span className="text-[#e6b24a]">
                  One direction.
                </span>
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-lg leading-8 text-[#53627b]">
                Evantra is structured around specialized centers because
                the problems we want to solve are too interconnected to
                belong to a single discipline.
              </p>

              <p className="mt-6 text-lg leading-8 text-[#53627b]">
                Software needs security. Artificial intelligence needs
                responsible engineering. Commerce needs infrastructure.
                Research needs a path to practical implementation.
                Engineering needs intelligent systems.
              </p>

              <p className="mt-6 text-lg leading-8 text-[#53627b]">
                Our centers allow each discipline to develop deeply while
                remaining connected to the wider Evantra ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            SIX CENTERS
        ====================================================== */}

        <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#d99e20]">
                Explore Evantra
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Our Companies &
                <br />
                <span className="text-[#e6b24a]">
                  Technology Centers
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-[#53627b]">
                Explore each center to understand its mission,
                technologies, capabilities, research and role within
                the Evantra ecosystem.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-[#10182c]/10 bg-[#10182c]/10 md:grid-cols-2">
              {centers.map((center) => {
                const Icon = center.icon;

                return (
                  <Link
                    key={center.href}
                    href={center.href}
                    className="group relative bg-white p-8 transition duration-300 hover:bg-[#f8f9fb] sm:p-10 lg:p-12"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
                        <Icon
                          size={25}
                          strokeWidth={1.7}
                          className="text-[#e6b24a]"
                        />
                      </div>

                      <span className="text-sm font-medium tracking-[0.15em] text-[#9aa3b3]">
                        {center.number}
                      </span>
                    </div>

                    <p className="mt-10 text-xs font-medium uppercase tracking-[0.22em] text-[#d99e20]">
                      {center.eyebrow}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                      {center.title}
                    </h3>

                    <p className="mt-5 max-w-xl text-base leading-7 text-[#53627b]">
                      {center.description}
                    </p>

                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#d99e20]">
                      Explore Center

                      <ArrowRight
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>

                    <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-0 bg-[#e6b24a] transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW THEY CONNECT
        ====================================================== */}

        <section className="bg-[#091522] px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#e6b24a]">
                  The Evantra Model
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Specialized by
                  <br />
                  <span className="text-[#e6b24a]">
                    discipline.
                  </span>
                  <br />
                  Connected by purpose.
                </h2>
              </div>

              <div>
                <p className="text-lg leading-8 text-white/60">
                  The six centers are not isolated businesses. They
                  are interconnected parts of one technology ecosystem.
                </p>

                <p className="mt-6 text-lg leading-8 text-white/60">
                  Knowledge, engineering capabilities and research can
                  move between centers, allowing ideas to progress from
                  research to engineering, from engineering to products,
                  and from products to real-world impact.
                </p>

                <Link
                  href="/contact"
                  className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#e6b24a] px-7 py-3.5 text-sm font-semibold text-[#091522] transition hover:bg-[#f0c261]"
                >
                  Work With Evantra
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#d99e20]">
              Explore the Ecosystem
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Technology is only powerful
              <br />
              <span className="text-[#e6b24a]">
                when it serves people.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#53627b]">
              Discover the companies and centers building the
              technologies that will shape Evantra&apos;s future.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/companies"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e6b24a] px-7 py-3.5 text-sm font-semibold text-[#091522] transition hover:bg-[#f0c261]"
              >
                Explore All Centers
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#10182c]/15 px-7 py-3.5 text-sm font-semibold text-[#10182c] transition hover:bg-[#f8f9fb]"
              >
                About Evantra
              </Link>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}