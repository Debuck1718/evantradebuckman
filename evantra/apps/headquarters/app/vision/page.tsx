import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Target, Users } from "lucide-react";

import { GlobalHeader, GlobalFooter } from "@/components/layout";

const principles = [
  {
    title: "Human-Centered Technology",
    description:
      "We build technology around real human needs, reducing complexity while preserving dignity, safety, and control.",
    icon: Users,
  },
  {
    title: "Responsible Innovation",
    description:
      "Innovation should create meaningful progress while remaining accountable, explainable, sustainable, and secure.",
    icon: Compass,
  },
  {
    title: "Security by Design",
    description:
      "Security and privacy are foundational engineering requirements rather than features added after a system is built.",
    icon: ShieldCheck,
  },
  {
    title: "Technology With Purpose",
    description:
      "Every Evantra initiative should solve a meaningful problem and create measurable value for people, organizations, and communities.",
    icon: Target,
  },
];

export default function VisionPage() {
  return (
    <>
      <GlobalHeader />

      <main className="min-h-screen bg-[#06131F] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,178,74,.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(11,79,113,.22),transparent_38%)]" />

          <div className="relative mx-auto max-w-[1440px] px-6 pb-24 pt-28 lg:px-10 lg:pt-36">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D6A43A]/30 bg-[#D6A43A]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#E6B24A]">
                <Compass className="h-4 w-4" />
                Evantra Vision
              </div>

              <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Engineering technology
                <span className="block text-[#E6B24A]">
                  that serves people.
                </span>
              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-white/65 sm:text-xl">
                Evantra exists to build technology that makes complex systems
                easier to understand, safer to use, and more useful to the
                people and organizations they serve.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-[#E6B24A] px-6 py-3 font-semibold text-[#06131F] transition hover:bg-[#F0C261]"
                >
                  Explore Evantra
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Work With Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Statement */}
        <section className="border-b border-white/10 bg-[#081521]">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#E6B24A]">
                Our Direction
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Building an ecosystem where technology serves society.
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-8 text-white/65">
              <p>
                We envision a future where sophisticated technology does not
                have to mean unnecessary complexity.
              </p>

              <p>
                Evantra is working toward an ecosystem in which artificial
                intelligence, software, cybersecurity, engineering, commerce,
                research, and digital infrastructure work together to solve
                practical problems.
              </p>

              <p>
                Our objective is not simply to build more technology. It is to
                build better systems — systems that are secure, responsible,
                accessible, sustainable, and designed around meaningful human
                outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#E6B24A]">
              Guiding Principles
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Principles behind the work.
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/60">
              These principles influence how Evantra approaches products,
              research, partnerships, engineering, and long-term decisions.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <article
                  key={principle.title}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-7 transition hover:border-[#E6B24A]/30 hover:bg-white/[0.05]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Icon className="h-5 w-5 text-[#E6B24A]" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {principle.title}
                  </h3>

                  <p className="mt-3 leading-7 text-white/60">
                    {principle.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Closing */}
        <section className="border-t border-white/10 bg-[#081521]">
          <div className="mx-auto max-w-[1000px] px-6 py-24 text-center lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#E6B24A]">
              The Evantra Way
            </p>

            <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Do the right thing, even when it is difficult.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
              We believe long-term technology companies are built through
              responsible decisions, strong engineering, honest relationships,
              and a commitment to creating useful systems.
            </p>

            <div className="mt-9">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#E6B24A] hover:text-[#F0C261]"
              >
                Return to Headquarters
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}