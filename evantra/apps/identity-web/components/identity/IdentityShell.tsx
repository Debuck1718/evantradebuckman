"use client";

import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

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
              <div className="mb-12 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
                  <ShieldCheck
                    size={21}
                    className="text-[#e6b24a]"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-[0.22em] text-white">
                    EVANTRA
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Identity
                  </p>
                </div>
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

            <div className="text-xs leading-6 text-white/35">
              <p>EVANTRA IDENTITY</p>
              <p>Secure access infrastructure.</p>
            </div>
          </section>

          {/* Authentication panel */}

          <section className="flex min-h-[650px] items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">

              <div className="mb-8 lg:hidden">
                <p className="text-sm font-semibold tracking-[0.22em] text-white">
                  EVANTRA
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Identity
                </p>
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

              <p className="mt-8 text-center text-xs text-white/30">
                Protected by Evantra Identity
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}