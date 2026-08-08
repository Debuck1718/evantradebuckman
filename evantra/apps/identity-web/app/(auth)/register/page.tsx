"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Loader2,
  UserRoundPlus,
} from "lucide-react";

import {
  registerAccount,
} from "../../lib/api";

import {
  IdentityShell,
} from "../../../components/identity/IdentityShell";

export default function RegisterPage() {
  const router = useRouter();

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
      });

      /*
       * Registration is complete.
       *
       * The account begins in
       * PENDING_VERIFICATION.
       *
       * Send the user directly to
       * Evantra Identity verification.
       */
      router.push(
        `/verify?email=${encodeURIComponent(
          normalizedEmail,
        )}`,
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
            href="/login"
            className="font-medium text-[#e6b24a] transition hover:text-[#f7d97f]"
          >
            Sign in
          </Link>
        </div>
      </form>
    </IdentityShell>
  );
}