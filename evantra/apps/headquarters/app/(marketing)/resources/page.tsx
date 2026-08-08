import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Globe2,
  Newspaper,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";

import {
  GlobalHeader,
  GlobalFooter,
} from "@/components/layout";

export const metadata: Metadata = {
  title: "Resources | Evantra",
  description:
    "Explore Evantra's research, technical knowledge, security insights, case studies, media and resources for understanding technology and innovation.",
};

const resources = [
  {
    icon: BookOpen,
    eyebrow: "Research",
    title: "Research & Innovation",
    description:
      "Explore the questions, technologies and ideas Evantra is investigating across artificial intelligence, cybersecurity and emerging technologies.",
    href: "/research",
    action: "Explore Research",
  },
  {
    icon: FileText,
    eyebrow: "Case Studies",
    title: "Case Studies",
    description:
      "Practical stories about technologies, systems and projects developed across the Evantra ecosystem.",
    href: "#case-studies",
    action: "View Case Studies",
    status: "In Development",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Security",
    title: "Security & Trust",
    description:
      "Perspectives on cybersecurity, privacy, responsible technology and the principles that guide secure digital systems.",
    href: "#security",
    action: "Explore Security",
  },
  {
    icon: FileText,
    eyebrow: "Technical Knowledge",
    title: "Technical Knowledge",
    description:
      "Engineering concepts, technology notes and practical knowledge from the systems and platforms Evantra builds.",
    href: "#technical",
    action: "Explore Knowledge",
  },
  {
    icon: Newspaper,
    eyebrow: "News & Updates",
    title: "Evantra News",
    description:
      "Updates about Evantra projects, research, companies, partnerships and developments across the ecosystem.",
    href: "#news",
    action: "View Updates",
  },
  {
    icon: PlayCircle,
    eyebrow: "Media & Brand",
    title: "Media & Brand",
    description:
      "Official Evantra media resources, visual identity materials and selected content for understanding the company.",
    href: "#media",
    action: "Explore Media",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <GlobalHeader />

      <main className="overflow-hidden bg-[#f8f9fb] text-[#0b1328]">
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden bg-[#071522] px-6 pb-28 pt-36 text-white md:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(230,178,74,0.15),transparent_35%),radial-gradient(circle_at_15%_80%,rgba(20,184,166,0.08),transparent_30%)]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#e6b24a]/30 bg-[#e6b24a]/10 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.24em] text-[#f0c45c]">
                <span className="h-2 w-2 rounded-full bg-[#e6b24a]" />
                Evantra Resources
              </div>

              <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
                Knowledge
                <br />
                <span className="text-[#e6b24a]">
                  Built to Be Shared.
                </span>
              </h1>

              <div className="mt-8 h-px w-24 bg-[#e6b24a]" />

              <p className="mt-8 max-w-3xl text-lg leading-8 text-white/65 md:text-xl">
                A growing collection of research, technical knowledge,
                security insights, case studies and information from across
                the Evantra ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            RESOURCE INTRO
        ====================================================== */}

        <section className="px-6 py-24 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d99f27]">
                  Knowledge Centre
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                  Learn what we
                  <br />
                  are building.
                </h2>
              </div>

              <div className="space-y-6 text-lg leading-8 text-[#53627a]">
                <p>
                  Technology becomes more useful when knowledge is accessible.
                  The Evantra Resources hub brings together information that
                  helps people understand our work and the technologies shaping
                  the future.
                </p>

                <p>
                  As Evantra&apos;s research and projects grow, this space will
                  become a public library for useful ideas, technical
                  knowledge, research and practical lessons.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            RESOURCE LIBRARY
        ====================================================== */}

        <section className="border-y border-[#dfe4eb] bg-white px-6 py-24 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d99f27]">
                Resource Library
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                Explore the Evantra
                <br />
                knowledge ecosystem.
              </h2>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {resources.map((resource) => {
                const Icon = resource.icon;

                return (
                  <article
                    key={resource.title}
                    className="group flex min-h-[350px] flex-col rounded-3xl border border-[#dfe4eb] bg-[#fbfcfd] p-7 transition hover:-translate-y-1 hover:border-[#e6b24a]/50 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e6b24a]/20 bg-[#e6b24a]/10">
                      <Icon
                        size={22}
                        className="text-[#d99f27]"
                      />
                    </div>

                    <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d99f27]">
                      {resource.eyebrow}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold">
                      {resource.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-[#64748b]">
                      {resource.description}
                    </p>

                    <div className="mt-auto pt-8">
                      {resource.status && (
                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8994a6]">
                          {resource.status}
                        </p>
                      )}

                      <Link
                        href={resource.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#d99f27] transition group-hover:gap-3"
                      >
                        {resource.action}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            CASE STUDIES
        ====================================================== */}

        <section
          id="case-studies"
          className="scroll-mt-24 px-6 py-24 md:px-10 lg:px-16"
        >
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#dfe4eb] bg-white p-8 md:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d99f27]">
                  Case Studies
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                  From ideas to
                  <br />
                  real systems.
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#53627a]">
                  Evantra&apos;s case-study library will document the problems
                  we encounter, the systems we engineer and the lessons learned
                  while building practical technologies.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e6b24a]/20 bg-[#e6b24a]/10 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d99f27]">
                  Status
                </p>

                <p className="mt-2 text-sm font-medium text-[#53627a]">
                  Case studies are currently in development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECURITY
        ====================================================== */}

        <section
          id="security"
          className="scroll-mt-24 bg-[#071522] px-6 py-24 text-white md:px-10 lg:px-16"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <ShieldCheck
                  size={34}
                  className="text-[#e6b24a]"
                />

                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
                  Security & Trust
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                  Technology must
                  <br />
                  earn trust.
                </h2>
              </div>

              <div className="space-y-6 text-base leading-8 text-white/55">
                <p>
                  Security is part of how Evantra thinks about technology, not
                  simply a feature added after a system is built.
                </p>

                <p>
                  Our security knowledge will cover cybersecurity engineering,
                  privacy, responsible AI, secure architecture and the
                  principles used to protect people and organizations.
                </p>

                <Link
                  href="/research"
                  className="inline-flex items-center gap-2 pt-3 text-sm font-semibold text-[#e6b24a]"
                >
                  Explore our research
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TECHNICAL KNOWLEDGE
        ====================================================== */}

        <section
          id="technical"
          className="scroll-mt-24 px-6 py-24 md:px-10 lg:px-16"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d99f27]">
                Technical Knowledge
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                Engineering knowledge
                <br />
                that can be shared.
              </h2>

              <p className="mt-6 text-lg leading-8 text-[#53627a]">
                This section will grow alongside the engineering systems,
                platforms and research developed by Evantra.
              </p>
            </div>

            <div className="mt-12 rounded-3xl border border-[#dfe4eb] bg-white p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Technical library
                  </p>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[#64748b]">
                    Architecture notes, engineering knowledge and practical
                    technical resources will be published here as they become
                    available.
                  </p>
                </div>

                <span className="w-fit rounded-full border border-[#dfe4eb] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#8994a6]">
                  Growing
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            NEWS
        ====================================================== */}

        <section
          id="news"
          className="scroll-mt-24 border-y border-[#dfe4eb] bg-white px-6 py-24 md:px-10 lg:px-16"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <Newspaper
                  size={34}
                  className="text-[#d99f27]"
                />

                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-[#d99f27]">
                  News & Updates
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                  Follow the
                  <br />
                  journey.
                </h2>
              </div>

              <div className="rounded-3xl bg-[#f8f9fb] p-8">
                <p className="text-sm leading-7 text-[#64748b]">
                  Evantra news and announcements will document meaningful
                  developments across our research, companies, products,
                  partnerships and ecosystem.
                </p>

                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#d99f27]"
                >
                  Connect with Evantra
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MEDIA
        ====================================================== */}

        <section
          id="media"
          className="scroll-mt-24 px-6 py-24 md:px-10 lg:px-16"
        >
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2rem] bg-[#e6b24a] p-8 text-[#071522] md:p-14">
              <Globe2 size={32} />

              <h2 className="mt-8 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                Understanding Evantra.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#071522]/70">
                Explore the company, our innovation campus, research,
                technology centers and the work we are building across the
                Evantra ecosystem.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/company"
                  className="inline-flex items-center gap-2 rounded-full bg-[#071522] px-6 py-3.5 text-sm font-semibold text-white"
                >
                  Explore Evantra
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[#071522]/20 px-6 py-3.5 text-sm font-semibold"
                >
                  Contact us
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}