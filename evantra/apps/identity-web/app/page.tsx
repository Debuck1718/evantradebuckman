import Link from "next/link";
import { ArrowRight, UserRoundPlus } from "lucide-react";

import { IdentityShell } from "../components/identity/IdentityShell";

export default function IdentityHomePage() {
  return (
    <IdentityShell
      title="Evantra Identity"
      description="Identity gateway for secure sign-in, account creation, and authorization across the Evantra ecosystem."
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-white/60">
          Continue to sign in with your existing Evantra ID, or create a new account to access products and
          services.
        </p>

        <div className="grid gap-3">
          <Link
            href="/login"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
          >
            Sign in
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/register"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Create Evantra ID
            <UserRoundPlus size={16} />
          </Link>
        </div>

        <p className="pt-2 text-xs leading-5 text-white/35">
          This page is the identity landing entrypoint. OAuth and workspace access will route through sign-in.
        </p>
      </div>
    </IdentityShell>
  );
}