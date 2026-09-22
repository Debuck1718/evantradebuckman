"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import Link from "next/link";
import {
  useSearchParams,
} from "next/navigation";

import {
  CheckCircle2,
  Loader2,
  Mail,
  UserRoundPlus,
} from "lucide-react";

import {
  registerAccount,
} from "../../lib/api";

import {
  IdentityShell,
} from "../../../components/identity/IdentityShell";

/**
 * Resolves the caller-supplied
 * returnTo value into a safe
 * same-origin path.
 *
 * Anything that is not a relative
 * path is discarded so a malicious
 * link can never redirect a visitor
 * off the identity origin.
 */
function safeReturnTo(
  returnTo: string | null,
): string {
  const value = returnTo ?? "";

  if (
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/workspace/account";
}

function RegisterPageContent() {
  const searchParams =
    useSearchParams();

  /*
   * Preserved across registration and
   * the verification round-trip so a
   * client app receives the user back
   * where they started.
   */
  const returnTo =
    safeReturnTo(
      searchParams.get("returnTo"),
    );

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [evantraId, setEvantraId] =
    useState("");

  const [contactEmail, setContactEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * Set once registration succeeds.
   * Holds the contact email the
   * verification message was sent to.
   */
  const [pendingEmail, setPendingEmail] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const normalizedFirstName =
      firstName.trim();

    const normalizedLastName =
      lastName.trim();

    const normalizedEvantraId =
      evantraId.trim().toLowerCase();

    const normalizedEmail =
      contactEmail.trim().toLowerCase();

    if (!normalizedFirstName) {
      setError(
        "Enter your first name.",
      );
      return;
    }

    if (!normalizedLastName) {
      setError(
        "Enter your last name.",
      );
      return;
    }

    if (!normalizedEvantraId) {
      setError(
        "Choose your Evantra ID.",
      );
      return;
    }

    if (!normalizedEmail) {
      setError(
        "Enter your contact email.",
      );
      return;
    }

    if (!password) {
      setError(
        "Create a password.",
      );
      return;
    }

    try {
      setLoading(true);

      await registerAccount({
        firstName:
          normalizedFirstName,

        lastName:
          normalizedLastName,

        evantraId:
          normalizedEvantraId,

        contactEmail:
          normalizedEmail,

        password,

        returnTo,
      });

      /*
       * Registration is complete.
       *
       * The account begins in
       * PENDING_VERIFICATION and a
       * verification email has been
       * sent.
       *
       * Verification happens through
       * the link in that email, so we
       * show a pending state here
       * instead of navigating to the
       * token-consuming /verify page.
       */
      setPendingEmail(
        normalizedEmail,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your Evantra ID.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Pending verification state.
   *
   * Shown after a successful
   * registration, in place of the
   * form, once the verification
   * email has been dispatched.
   */
  if (pendingEmail) {
    return (
      <IdentityShell
        title="Check your email"
        description="Your Evantra ID has been created and is awaiting verification."
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-[#e6b24a]/20 bg-[#e6b24a]/10">
            <Mail
              size={28}
              className="text-[#e6b24a]"
            />
          </div>

          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
            Pending verification
          </p>

          <h2 className="text-2xl font-semibold text-white">
            Verify your Evantra ID
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/50">
            We sent a verification link to{" "}
            <span className="font-medium text-white/80">
              {pendingEmail}
            </span>
            . Open that email and confirm your
            verification to activate your
            Evantra ID.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-white/40">
            <CheckCircle2
              size={16}
              className="shrink-0 text-emerald-400"
            />

            Your account stays pending until
            the email is confirmed.
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={returnTo}
              className="w-full rounded-xl bg-gradient-to-r from-[#f7d97f] via-[#e6b24a] to-[#c99322] px-5 py-3 text-center text-sm font-semibold text-[#06131f] shadow-lg shadow-[#e6b24a]/10 transition hover:-translate-y-0.5 hover:shadow-[#e6b24a]/20"
            >
              Continue to sign in
            </Link>

            <Link
              href={`/verify/resend?returnTo=${encodeURIComponent(
                returnTo,
              )}`}
              className="w-full rounded-xl border-white/10 px-5 py-3 text-center text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Resend verification email
            </Link>
          </div>
        </div>
      </IdentityShell>
    );
  }

  return (
    <IdentityShell
      title="Create your Evantra ID"
      description="Create your identity for secure access across the Evantra digital ecosystem."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* First name */}

        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            First name
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) =>
              setFirstName(
                event.target.value,
              )
            }
            placeholder="Enter your first name"
            disabled={loading}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#e6b24a]/10 disabled:opacity-50"
          />
        </div>

        {/* Last name */}

        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            Last name
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(event) =>
              setLastName(
                event.target.value,
              )
            }
            placeholder="Enter your last name"
            disabled={loading}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#e6b24a]/10 disabled:opacity-50"
          />
        </div>

        {/* Evantra ID */}

        <div>
          <label
            htmlFor="evantraId"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            Evantra ID
          </label>

          <div className="flex h-12 overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] focus-within:border-[#e6b24a]/50 focus-within:ring-2 focus-within:ring-[#e6b24a]/10">
            <input
              id="evantraId"
              name="evantraId"
              type="text"
              autoComplete="username"
              value={evantraId}
              onChange={(event) =>
                setEvantraId(
                  event.target.value
                    .replace(
                      /@evantra$/i,
                      "",
                    ),
                )
              }
              placeholder="yourname"
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/25 disabled:opacity-50"
            />

            <div className="flex items-center border-l border-white/10 bg-white/[0.025] px-4 text-sm font-medium text-[#e6b24a]">
              @evantra
            </div>
          </div>

          <p className="mt-2 text-xs leading-5 text-white/30">
            This becomes your unique Evantra
            Identity.
          </p>
        </div>

        {/* Contact email */}

        <div>
          <label
            htmlFor="contactEmail"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            Contact email
          </label>

          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            autoComplete="email"
            value={contactEmail}
            onChange={(event) =>
              setContactEmail(
                event.target.value,
              )
            }
            placeholder="you@example.com"
            disabled={loading}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#e6b24a]/10 disabled:opacity-50"
          />
        </div>

        {/* Password */}

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value,
              )
            }
            placeholder="Create a password"
            disabled={loading}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#e6b24a]/10 disabled:opacity-50"
          />
        </div>

        {/* Error */}

        {error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200">
            {error}
          </div>
        )}

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f7d97f] via-[#e6b24a] to-[#c99322] px-5 text-sm font-semibold text-[#06131f] shadow-lg shadow-[#e6b24a]/10 transition hover:-translate-y-0.5 hover:shadow-[#e6b24a]/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Creating your Evantra ID...
            </>
          ) : (
            <>
              <UserRoundPlus
                size={18}
              />

              Create Evantra ID
            </>
          )}
        </button>

        {/* Login */}

        <div className="pt-2 text-center text-sm text-white/40">
          Already have an Evantra ID?{" "}
          <Link
            href={`/login?returnTo=${encodeURIComponent(
              returnTo,
            )}`}
            className="font-medium text-[#e6b24a] transition hover:text-[#f7d97f]"
          >
            Sign in
          </Link>
        </div>
      </form>
    </IdentityShell>
  );
}

/**
 * useSearchParams requires a Suspense
 * boundary during prerendering.
 */
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <IdentityShell
          title="Create your Evantra ID"
          description="Create your identity for secure access across the Evantra digital ecosystem."
        >
          <div className="flex items-center justify-center py-10 text-sm text-white/50">
            Loading...
          </div>
        </IdentityShell>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}