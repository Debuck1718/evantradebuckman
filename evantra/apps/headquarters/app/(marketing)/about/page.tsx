import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Globe2,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { GlobalHeader, GlobalFooter } from "@/components/layout";

export const metadata = {
  title: "About | Evantra De-Buckman Ventures",
  description:
    "Learn about Evantra De-Buckman Ventures, its purpose, principles, and vision for engineering technology that serves people.",
};

const principles = [
  {
    icon: ShieldCheck,
    eyebrow: "SECURITY",
    title: "Trust by Design",
    description:
      "Security, privacy, resilience and responsible technology are considered from the beginning—not added after the system is built.",
  },
  {
    icon: Users,
    eyebrow: "PEOPLE",
    title: "Human-Centered Engineering",
    description:
      "Technology should reduce complexity, ease burdens and expand human capability while respecting the people who depend on it.",
  },
  {
    icon: Sparkles,
    eyebrow: "INNOVATION",
    title: "Build What Matters",
    description:
      "We pursue practical innovation that can become useful products, services and systems capable of solving meaningful problems.",
  },
  {
    icon: Globe2,
    eyebrow: "IMPACT",
    title: "Built for a Wider World",
    description:
      "Evantra is being built with Africa in mind and with an ambition to create technology capable of serving people beyond borders.",
  },
];

const capabilities = [
  "Software Engineering",
  "Artificial Intelligence",
  "Cybersecurity",
  "Research & Innovation",
  "Connected Systems",
  "Global Commerce",
];

export default function AboutPage() {
  return (
    <>
      <GlobalHeader />

      <main
        id="main-content"
        className="relative overflow-hidden bg-white text-[#0b1328]"
      >
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden bg-[#071522] px-6 pb-24 pt-36 text-white md:px-10 md:pb-32 md:pt-44">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(230,178,74,0.14),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(36,91,125,0.18),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/5 px-5 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e6b24a]" />

                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#e6b24a]">
                  About Evantra
                </span>
              </div>

              <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-7xl lg:text-[88px]">
                Engineering
                <br />
                <span className="text-[#e6b24a]">
                  Technology That
                </span>
                <br />
                Serves People.
              </h1>

              <div className="mt-10 h-px w-24 bg-[#e6b24a]" />

              <p className="mt-8 max-w-3xl text-lg leading-8 text-white/65 md:text-xl md:leading-9">
                Evantra De-Buckman Ventures is building a technology
                enterprise around engineering, research, innovation and
                responsible digital systems—creating solutions designed
                to make complex technology useful, secure and human-centered.
              </p>
            </div>

            <div className="mt-16 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-semibold text-[#e6b24a]">
                  Engineering
                </p>
                <p className="mt-2 text-sm text-white/40">
                  Building practical systems
                </p>
              </div>

              <div>
                <p className="text-3xl font-semibold text-[#e6b24a]">
                  Research
                </p>
                <p className="mt-2 text-sm text-white/40">
                  Exploring what comes next
                </p>
              </div>

              <div>
                <p className="text-3xl font-semibold text-[#e6b24a]">
                  Impact
                </p>
                <p className="mt-2 text-sm text-white/40">
                  Technology in service of people
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WHO WE ARE
        ====================================================== */}

        <section className="relative px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/5 px-5 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e6b24a]" />

                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d49d2c]">
                  Who We Are
                </span>
              </div>

              <h2 className="mt-7 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                A technology
                <br />
                <span className="text-[#e6b24a]">
                  enterprise with purpose.
                </span>
              </h2>
            </div>

            <div className="space-y-7 text-lg leading-8 text-[#50617b]">
              <p>
                Evantra De-Buckman Ventures is being built as a technology
                enterprise focused on creating useful systems, products and
                ventures that address real-world needs.
              </p>

              <p>
                Our work brings together software engineering, cybersecurity,
                artificial intelligence, research, connected systems and
                commerce into an ecosystem where different capabilities can
                reinforce one another.
              </p>

              <p>
                The goal is not technology for technology&apos;s sake.
                We believe engineering should make difficult things easier,
                improve how people and organizations operate, and create
                opportunities for meaningful progress.
              </p>

              <p className="font-medium text-[#17233a]">
                This is the foundation of Evantra:
                <span className="text-[#d49d2c]">
                  {" "}
                  build responsibly, think long-term, and create technology
                  that serves people.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            PURPOSE
        ====================================================== */}

        <section className="border-y border-[#dbe1e8] bg-[#f7f8fa] px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d49d2c]">
                Our Purpose
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Technology should
                <br />
                <span className="text-[#dca83c]">
                  ease the burden.
                </span>
              </h2>

              <p className="mt-7 text-lg leading-8 text-[#50617b]">
                Evantra exists to leverage technology to ease the burden
                placed on individuals and organizations while maintaining
                their safety, security and well-being.
              </p>
            </div>

            <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-[#dbe1e8] bg-[#dbe1e8] md:grid-cols-3">
              <div className="bg-white p-8 md:p-10">
                <Target className="h-8 w-8 text-[#e6b24a]" />

                <h3 className="mt-8 text-xl font-semibold">
                  Solve Problems
                </h3>

                <p className="mt-4 leading-7 text-[#60708a]">
                  Identify meaningful problems and engineer solutions
                  that make a measurable difference.
                </p>
              </div>

              <div className="bg-white p-8 md:p-10">
                <Building2 className="h-8 w-8 text-[#e6b24a]" />

                <h3 className="mt-8 text-xl font-semibold">
                  Build Systems
                </h3>

                <p className="mt-4 leading-7 text-[#60708a]">
                  Create reliable technology infrastructure capable of
                  supporting products, organizations and future ventures.
                </p>
              </div>

              <div className="bg-white p-8 md:p-10">
                <Globe2 className="h-8 w-8 text-[#e6b24a]" />

                <h3 className="mt-8 text-xl font-semibold">
                  Create Impact
                </h3>

                <p className="mt-4 leading-7 text-[#60708a]">
                  Turn engineering and innovation into practical outcomes
                  that can improve lives and strengthen communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRINCIPLES
        ====================================================== */}

        <section className="px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d49d2c]">
                Guiding Principles
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                How we choose
                <br />
                <span className="text-[#e0a936]">
                  to build.
                </span>
              </h2>

              <p className="mt-7 text-lg leading-8 text-[#60708a]">
                As Evantra grows, these principles provide a foundation
                for how we approach technology, people, risk and
                long-term decisions.
              </p>
            </div>

            <div className="mt-16 grid gap-x-16 gap-y-14 md:grid-cols-2">
              {principles.map((principle) => {
                const Icon = principle.icon;

                return (
                  <article
                    key={principle.title}
                    className="border-t border-[#dbe1e8] pt-8"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e6b24a]/10">
                      <Icon className="h-6 w-6 text-[#dca83c]" />
                    </div>

                    <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.25em] text-[#d49d2c]">
                      {principle.eyebrow}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold">
                      {principle.title}
                    </h3>

                    <p className="mt-4 max-w-xl leading-7 text-[#60708a]">
                      {principle.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            ECOSYSTEM
        ====================================================== */}

        <section className="bg-[#071522] px-6 py-24 text-white md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#e6b24a]">
                  The Evantra Ecosystem
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                  Multiple disciplines.
                  <br />
                  <span className="text-[#e6b24a]">
                    One direction.
                  </span>
                </h2>
              </div>

              <div>
                <p className="text-lg leading-8 text-white/55">
                  Evantra&apos;s ecosystem brings specialized disciplines
                  together rather than treating them as isolated areas.
                  Software can enable AI. AI can strengthen products.
                  Cybersecurity protects the systems. Research opens new
                  possibilities. Commerce takes useful solutions into the
                  world.
                </p>

                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {capabilities.map((capability, index) => (
                    <div
                      key={capability}
                      className="flex items-center gap-4 border border-white/10 bg-white/[0.03] px-5 py-5"
                    >
                      <span className="text-sm font-medium text-[#e6b24a]">
                        0{index + 1}
                      </span>

                      <span className="text-sm font-medium text-white/75">
                        {capability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            VISION
        ====================================================== */}

        <section className="px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/5 px-5 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e6b24a]" />

              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d49d2c]">
                Our Vision
              </span>
            </div>

            <h2 className="mt-8 text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
              A seamless,
              <br />
              secure and
              <br />
              <span className="text-[#e6b24a]">
                human-centered
              </span>
              <br />
              digital ecosystem.
            </h2>

            <div className="mx-auto mt-10 h-px w-24 bg-[#e6b24a]" />

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#60708a]">
              We envision a future where complex technology serves society
              transparently, sustainably and ethically—and where engineering
              becomes a practical force for improving the way people live,
              work and build.
            </p>
          </div>
        </section>

        {/* =====================================================
            DECISION PRINCIPLE
        ====================================================== */}

        <section className="px-6 pb-24 md:px-10 md:pb-32">
          <div className="mx-auto max-w-5xl rounded-3xl border border-[#dbe1e8] bg-[#f7f8fa] p-8 md:p-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d49d2c]">
              A Principle for the Journey
            </p>

            <blockquote className="mt-7 text-3xl font-medium leading-tight tracking-tight text-[#111a2f] md:text-5xl">
              “Do not make a decision that you will regret if not now,
              in the future. Do the right thing even if it is difficult.”
            </blockquote>

            <p className="mt-7 max-w-2xl leading-7 text-[#60708a]">
              Growth should never become an excuse to abandon responsibility.
              The decisions Evantra makes today should remain defensible
              when viewed years from now.
            </p>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}

        <section className="bg-[#e6b24a] px-6 py-20 md:px-10 md:py-24">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#071522]/60">
                Build With Evantra
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#071522] md:text-5xl">
                Technology is only valuable when it serves a purpose.
              </h2>
            </div>

            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#071522] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#101f30]"
            >
              Work With Us

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