import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  BrainCircuit,
  FlaskConical,
  Globe2,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  GlobalHeader,
  GlobalFooter,
} from "@/components/layout";

export const metadata: Metadata = {
  title: "Research & Innovation | Evantra",
  description:
    "Explore Evantra's research initiatives across artificial intelligence, responsible technology, healthcare intelligence, connected systems and emerging technologies.",
};

const initiatives = [
  {
    year: "2026",
    title: "LabReport AI",
    description:
      "Applied artificial intelligence research focused on making laboratory information easier to understand while connecting people with verified healthcare professionals.",
    icon: HeartPulse,
  },
  {
    year: "2026",
    title: "Security-by-Ethics",
    description:
      "Research into practical AI governance built around explainability, fairness, transparency, privacy, security and meaningful human oversight.",
    icon: ShieldCheck,
  },
  {
    year: "2027",
    title: "Enterprise AI Research",
    description:
      "Research into intelligent assistants, knowledge platforms, workflow automation and organizational decision-support systems.",
    icon: BrainCircuit,
  },
  {
    year: "FUTURE",
    title: "African Language AI",
    description:
      "Exploring multilingual AI supporting African languages, localized knowledge systems and culturally aware conversational technologies.",
    icon: Globe2,
  },
  {
    year: "FUTURE",
    title: "Evantra AI Laboratory",
    description:
      "A future research environment dedicated to applied machine learning, healthcare intelligence, computer vision and responsible AI.",
    icon: FlaskConical,
  },
  {
    year: "FUTURE",
    title: "Global Research Collaborations",
    description:
      "Building relationships with universities, research institutions, governments and industry leaders to accelerate responsible technology research.",
    icon: Sparkles,
  },
];

const principles = [
  {
    title: "Research Before Hype",
    description:
      "We investigate emerging technologies carefully before turning them into products, systems or services.",
  },
  {
    title: "Responsible by Design",
    description:
      "Security, privacy, explainability, fairness and human oversight belong inside the engineering process—not after it.",
  },
  {
    title: "Applied Research",
    description:
      "Our goal is not research for research's sake. We look for ways knowledge can become useful technology that serves people.",
  },
  {
    title: "Africa as a Laboratory",
    description:
      "We study problems and opportunities within African environments while building technologies capable of creating global impact.",
  },
];

export default function ResearchPage() {
  return (
    <>
      <GlobalHeader />

      <main
        id="main-content"
        className="overflow-hidden bg-white text-[#0b1328]"
      >
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden bg-[#071522] px-6 pb-24 pt-36 text-white md:px-10 md:pb-32 md:pt-44">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(230,178,74,0.15),transparent_30%),radial-gradient(circle_at_10%_80%,rgba(35,87,122,0.22),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-5xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/5 px-5 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e6b24a]" />

                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#e6b24a]">
                  Evantra Research
                </span>
              </div>

              <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-7xl lg:text-[88px]">
                Researching
                <br />
                <span className="text-[#e6b24a]">
                  What Comes Next.
                </span>
              </h1>

              <div className="mt-10 h-px w-24 bg-[#e6b24a]" />

              <p className="mt-8 max-w-3xl text-lg leading-8 text-white/60 md:text-xl md:leading-9">
                Evantra explores emerging technologies, studies real-world
                problems and turns useful knowledge into responsible systems
                that can improve lives, strengthen organizations and expand
                human capability.
              </p>
            </div>

            <div className="mt-16 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
              <div>
                <p className="text-4xl font-semibold text-[#e6b24a]">
                  Applied
                </p>

                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  Research Philosophy
                </p>
              </div>

              <div>
                <p className="text-4xl font-semibold text-[#e6b24a]">
                  Responsible
                </p>

                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  Technology Principle
                </p>
              </div>

              <div>
                <p className="text-4xl font-semibold text-[#e6b24a]">
                  Global
                </p>

                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  Long-Term Ambition
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INTRO
        ====================================================== */}

        <section className="bg-white px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d49d2c]">
                Why We Research
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                Turning questions
                <br />
                into
                <span className="text-[#dfa83b]">
                  {" "}
                  possibilities.
                </span>
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-8 text-[#60708a]">
              <p>
                Technology changes quickly. Evantra believes the best way to
                navigate that change is through disciplined research,
                experimentation and engineering.
              </p>

              <p>
                Our research connects the disciplines across the Evantra
                ecosystem—from artificial intelligence and cybersecurity to
                software engineering, connected systems, commerce and
                emerging technologies.
              </p>

              <p>
                We are particularly interested in technologies that can solve
                difficult problems in healthcare, education, enterprise,
                public services and the broader African technology ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            INITIATIVES
        ====================================================== */}

        <section className="border-y border-[#e5e9ef] bg-[#f7f8fa] px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d49d2c]">
                Research Portfolio
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                From current work
                <br />
                to future
                <span className="text-[#dfa83b]">
                  {" "}
                  laboratories.
                </span>
              </h2>

              <p className="mt-7 text-lg leading-8 text-[#60708a]">
                Evantra's research portfolio evolves with the problems we
                believe technology can meaningfully address.
              </p>
            </div>

            <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-[#dbe1e8] bg-[#dbe1e8] md:grid-cols-2">
              {initiatives.map((initiative) => {
                const Icon = initiative.icon;

                return (
                  <article
                    key={initiative.title}
                    className="group bg-white p-8 transition hover:bg-[#fbfcfd] md:p-10"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
                        <Icon
                          size={22}
                          className="text-[#d49d2c]"
                          strokeWidth={1.7}
                        />
                      </div>

                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9aa5b5]">
                        {initiative.year}
                      </span>
                    </div>

                    <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                      {initiative.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-[#60708a]">
                      {initiative.description}
                    </p>

                    <div className="mt-7 h-px w-10 bg-[#e6b24a] transition-all group-hover:w-16" />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            PRINCIPLES
        ====================================================== */}

        <section className="bg-[#071522] px-6 py-24 text-white md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#e6b24a]">
                  Research Principles
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                  Curiosity
                  <br />
                  with
                  <span className="text-[#e6b24a]">
                    {" "}
                    responsibility.
                  </span>
                </h2>

                <p className="mt-7 max-w-xl text-lg leading-8 text-white/50">
                  Innovation only matters when it creates useful outcomes.
                  Research therefore remains connected to ethics, security,
                  human needs and measurable impact.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {principles.map((principle, index) => (
                  <article
                    key={principle.title}
                    className="border border-white/10 bg-white/[0.03] p-7"
                  >
                    <span className="text-xs font-semibold text-[#e6b24a]">
                      0{index + 1}
                    </span>

                    <h3 className="mt-6 text-xl font-semibold">
                      {principle.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-white/45">
                      {principle.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RESEARCH NETWORK
        ====================================================== */}

        <section className="bg-white px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d49d2c]">
                  Connected Research
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                  Six disciplines.
                  <br />
                  <span className="text-[#dfa83b]">
                    One research ecosystem.
                  </span>
                </h2>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-[#60708a]">
                  Research does not exist separately from the rest of
                  Evantra. Ideas can move between software engineering,
                  artificial intelligence, cybersecurity, research &
                  innovation, connected systems and global commerce.
                </p>

                <Link
                  href="/companies"
                  className="group mt-9 inline-flex items-center gap-3 text-sm font-semibold text-[#b68118]"
                >
                  Explore the six centers

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div className="rounded-3xl border border-[#dbe1e8] bg-[#f7f8fa] p-6 md:p-8">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Software Engineering",
                    "Artificial Intelligence",
                    "Cybersecurity",
                    "Research & Innovation",
                    "Connected Systems",
                    "Global Commerce",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#dbe1e8] bg-white p-5"
                    >
                      <p className="text-[10px] font-semibold text-[#d49d2c]">
                        0{index + 1}
                      </p>

                      <p className="mt-3 text-sm font-semibold leading-5">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-2xl border border-[#e6b24a]/30 bg-[#071522] px-5 py-6 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#e6b24a]">
                    Evantra Research Ecosystem
                  </p>

                  <p className="mt-2 text-sm text-white/45">
                    Engineering • Intelligence • Security • Research •
                    Infrastructure • Commerce
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}

        <section className="bg-[#e6b24a] px-6 py-20 md:px-10 md:py-24">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#071522]/60">
                Explore Evantra
              </p>

              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-[#071522] md:text-5xl">
                Discover the technologies and ideas shaping our future.
              </h2>
            </div>

            <Link
              href="/companies"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#071522] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#101f30]"
            >
              Explore the ecosystem

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}