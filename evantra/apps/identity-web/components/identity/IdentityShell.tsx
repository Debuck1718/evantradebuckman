"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { EvantraBrandIcon } from "../brand/EvantraBrandIcon";

interface IdentityShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function IdentityShell({
  children,
  title = "Evantra Identity",
  description = "Secure access to the Evantra digital ecosystem.",
}: IdentityShellProps) {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025] shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">

          {/* Brand panel */}
          <section className="hidden min-h-[650px] flex-col justify-between border-r border-white/10 bg-gradient-to-br from-[#0b4f71]/40 via-[#06131f] to-[#06131f] p-12 lg:flex">
            <div>
              <div className="mb-12 flex items-center justify-between">
                <Link
                  href="/"
                  className="group flex items-center gap-3.5 transition"
                >
                  <EvantraBrandIcon size={44} />

                  <div>
                    <p className="text-sm font-semibold tracking-[0.24em] text-white group-hover:text-[#fae59a] transition">
                      EVANTRA
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#e6b24a]/80">
                      Identity
                    </p>
                  </div>
                </Link>

                <Link
                  href="/workspace/hub"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/70 transition hover:border-[#e6b24a]/40 hover:bg-[#e6b24a]/10 hover:text-[#e6b24a]"
                >
                  <span>Workspace</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-[#e6b24a]">
                Secure Identity
              </p>

              <h1 className="max-w-md text-4xl font-semibold leading-tight text-white">
                One identity.
                <br />
                Every Evantra
                <br />
                experience.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-white/60">
                Your Evantra ID provides secure access
                across the Evantra digital ecosystem.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/40">
              <div>
                <p className="font-semibold tracking-[0.16em] text-white/60">EVANTRA IDENTITY</p>
                <p className="mt-0.5">Unified Auth &amp; Enterprise SSO</p>
              </div>

              <Link
                href="/workspace/hub"
                className="text-[#e6b24a] transition hover:text-[#fae59a] hover:underline"
              >
                Go to Workspace &rarr;
              </Link>
            </div>
          </section>

          {/* Authentication panel */}
          <section className="flex min-h-[650px] items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">

              {/* Mobile Header with Brand Icon and Workspace shortcut */}
              <div className="mb-8 flex items-center justify-between lg:hidden">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                >
                  <EvantraBrandIcon size={38} />

                  <div>
                    <p className="text-sm font-semibold tracking-[0.22em] text-white">
                      EVANTRA
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#e6b24a]/80">
                      Identity
                    </p>
                  </div>
                </Link>

                <Link
                  href="/workspace/hub"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70 transition hover:border-[#e6b24a]/40 hover:text-[#e6b24a]"
                >
                  Workspace
                </Link>
              </div>

              <div className="mb-8">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
                  {title}
                </p>

                <h2 className="text-3xl font-semibold text-white">
                  {title === "Evantra Identity"
                    ? "Welcome back."
                    : title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  {description}
                </p>
              </div>

              {children}

              <div className="mt-8 flex flex-col items-center gap-2 text-center text-xs text-white/35">
                <p>Protected by Evantra Identity</p>
                <Link
                  href="/workspace/hub"
                  className="text-white/45 transition hover:text-[#e6b24a]"
                >
                  Switch to Workspace
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}