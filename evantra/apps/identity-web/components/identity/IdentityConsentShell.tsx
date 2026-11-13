import Link from "next/link";
import type { ReactNode } from "react";

import { EvantraBrandIcon } from "../brand/EvantraBrandIcon";

interface IdentityConsentShellProps {
  children: ReactNode;
}

export function IdentityConsentShell({ children }: IdentityConsentShellProps) {
  return (
    <main className="min-h-screen px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100svh-2rem)] max-w-2xl items-center justify-center">
        <section className="w-full rounded-2xl border-white/10 bg-[#091a28]/90 p-4 shadow-2xl backdrop-blur sm:rounded-3xl sm:p-8">
          <header className="mb-5 flex items-center gap-3 sm:mb-7">
            <Link href="/" aria-label="Evantra Identity home">
              <EvantraBrandIcon size={36} />
            </Link>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-white">
                EVANTRA
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#e6b24a]/80">
                Identity
              </p>
            </div>
          </header>
          {children}
          <footer className="mt-5 text-center text-xs text-white/35 sm:mt-7">
            Protected by Evantra Identity
          </footer>
        </section>
      </div>
    </main>
  );
}
