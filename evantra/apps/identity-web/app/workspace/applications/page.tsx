"use client";

import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Plus,
  ShieldCheck,
} from "lucide-react";

const applications = [
  {
    name: "StoreForge",
    description:
      "Evantra commerce and storefront platform.",
    status: "Connected",
  },
];

export default function ApplicationsPage() {
  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e6b24a]">
              Evantra Identity
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Applications
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
              Manage applications that use Evantra Identity to
              authenticate users and access approved account information.
            </p>
          </div>

          <Link
            href="/workspace/applications/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
          >
            <Plus size={17} />
            Register application
          </Link>

        </div>

        <section className="mt-10">

          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/30">
            <ShieldCheck size={15} />
            Connected applications
          </div>

          <div className="space-y-4">

            {applications.map((application) => (
              <div
                key={application.name}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-white/15"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e6b24a]/10 text-[#e6b24a]">
                        {application.name.charAt(0)}
                      </div>

                      <div>
                        <h2 className="font-semibold">
                          {application.name}
                        </h2>

                        <p className="mt-1 text-xs text-emerald-300/70">
                          {application.status}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-white/40">
                      {application.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#e6b24a] transition hover:text-[#f0c15e]"
                  >
                    Manage
                    <ArrowRight size={16} />
                  </button>

                </div>
              </div>
            ))}

          </div>

        </section>

        <section className="mt-12 rounded-2xl border border-[#e6b24a]/15 bg-[#e6b24a]/[0.035] p-6 md:p-8">

          <div className="flex gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6b24a]/10 text-[#e6b24a]">
              <ShieldCheck size={19} />
            </div>

            <div>
              <h2 className="font-semibold">
                Evantra OAuth
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                Applications registered here can use Evantra Identity
                through OAuth. You control which applications can access
                your identity and the permissions they receive.
              </p>
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}