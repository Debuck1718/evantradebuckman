import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe2,
  Mail,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import {
  GlobalHeader,
  GlobalFooter,
} from "@/components/layout";

export const metadata: Metadata = {
  title: "Contact Evantra | Evantra De-Buckman Ventures",
  description:
    "Connect with Evantra De-Buckman Ventures for business partnerships, technology engagements, research collaboration, institutional relationships and general inquiries.",
};

const inquiryTypes = [
  {
    title: "Business & Partnerships",
    description:
      "Explore partnerships, commercial opportunities, strategic relationships and new ventures across the Evantra ecosystem.",
    icon: Building2,
  },
  {
    title: "Technology & Engineering",
    description:
      "Discuss software, cybersecurity, artificial intelligence, engineering systems and other technology engagements.",
    icon: ShieldCheck,
  },
  {
    title: "Research & Innovation",
    description:
      "Connect with Evantra around research, emerging technologies, experimentation and collaborative innovation.",
    icon: Globe2,
  },
];

export default function ContactPage() {
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
                  Connect With Evantra
                </span>
              </div>

              <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
                Let&apos;s Build
                <br />
                <span className="text-[#e6b24a]">
                  What Comes Next.
                </span>
              </h1>

              <div className="mt-10 h-1 w-24 bg-[#e6b24a]" />

              <p className="mt-9 max-w-3xl text-lg leading-8 text-[#53627b] sm:text-xl">
                Whether you are looking to work with Evantra, explore a
                partnership, collaborate on research or simply learn more
                about what we are building, we would like to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT OPTIONS
        ====================================================== */}

        <section className="border-y border-[#10182c]/10 bg-[#f8f9fb] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#d99e20]">
                Start a Conversation
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                What would you like
                <br />
                <span className="text-[#e6b24a]">
                  to explore?
                </span>
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {inquiryTypes.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-[#10182c]/10 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
                      <Icon
                        size={25}
                        strokeWidth={1.7}
                        className="text-[#e6b24a]"
                      />
                    </div>

                    <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-base leading-7 text-[#53627b]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT FORM
        ====================================================== */}

        <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            {/* Information */}

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#d99e20]">
                Contact Evantra
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Tell us what
                <br />
                you&apos;re building.
              </h2>

              <p className="mt-7 max-w-xl text-lg leading-8 text-[#53627b]">
                Give us enough context to understand what you are trying
                to accomplish, where you are today and how you think
                Evantra could contribute.
              </p>

              <div className="mt-10 space-y-5">
                <div className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6b24a]/10">
                    <MessageSquare
                      size={18}
                      className="text-[#d99e20]"
                    />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Start with the problem
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#53627b]">
                      Explain the challenge, opportunity or idea you want
                      to discuss.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6b24a]/10">
                    <Globe2
                      size={18}
                      className="text-[#d99e20]"
                    />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Identify the area
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#53627b]">
                      Tell us whether your inquiry relates to a specific
                      Evantra center or a broader opportunity.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6b24a]/10">
                    <Mail
                      size={18}
                      className="text-[#d99e20]"
                    />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Leave a way to reach you
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#53627b]">
                      Provide accurate contact information so the
                      appropriate team can respond.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}

            <div className="rounded-[2rem] border border-[#10182c]/10 bg-[#f8f9fb] p-6 shadow-sm sm:p-8 lg:p-10">
              <form className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      className="mt-2 w-full rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9aa3b3] focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10"
                      placeholder="Your first name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      className="mt-2 w-full rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9aa3b3] focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-2 w-full rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9aa3b3] focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="text-sm font-medium"
                  >
                    Organization
                    <span className="ml-2 text-[#9aa3b3]">
                      Optional
                    </span>
                  </label>

                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    autoComplete="organization"
                    className="mt-2 w-full rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9aa3b3] focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10"
                    placeholder="Company or organization"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inquiryType"
                    className="text-sm font-medium"
                  >
                    Inquiry type
                  </label>

                  <select
                    id="inquiryType"
                    name="inquiryType"
                    required
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10"
                  >
                    <option value="" disabled>
                      Select an inquiry type
                    </option>

                    <option value="business">
                      Business & Partnerships
                    </option>

                    <option value="technology">
                      Technology & Engineering
                    </option>

                    <option value="research">
                      Research & Innovation
                    </option>

                    <option value="general">
                      General Inquiry
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-medium"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    className="mt-2 w-full resize-y rounded-xl border border-[#10182c]/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9aa3b3] focus:border-[#e6b24a] focus:ring-4 focus:ring-[#e6b24a]/10"
                    placeholder="Tell us about your project, opportunity or inquiry..."
                  />
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-[#10182c]/10 bg-white p-4">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#e6b24a]"
                  />

                  <p className="text-xs leading-5 text-[#53627b]">
                    Please avoid submitting passwords, authentication
                    tokens or other sensitive credentials through this
                    form.
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-6 py-4 text-sm font-semibold text-[#091522] transition hover:bg-[#f0c261]"
                >
                  Send Inquiry
                  <ArrowRight size={17} />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* =====================================================
            ECOSYSTEM CTA
        ====================================================== */}

        <section className="bg-[#091522] px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#e6b24a]">
              Explore Before You Reach Out
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Find the Evantra center
              <br />
              <span className="text-[#e6b24a]">
                closest to your needs.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
              Explore our six technology centers and discover the
              capabilities, research and solutions being developed
              across the Evantra ecosystem.
            </p>

            <Link
              href="/company"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#e6b24a] px-7 py-3.5 text-sm font-semibold text-[#091522] transition hover:bg-[#f0c261]"
            >
              Explore Evantra Companies
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}