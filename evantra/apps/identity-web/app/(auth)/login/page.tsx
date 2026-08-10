"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import {
  authenticate,
} from "../../lib/api";
import {
  buildWorkspaceUrl,
  isAllowedAbsoluteSurfaceUrl,
} from "../../lib/surfaceUrls";

import {
  IdentityShell,
} from "../../../components/identity/IdentityShell";

function LoginPageContent() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const [evantraId, setEvantraId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const normalizedId =
      evantraId.trim();

    if (!normalizedId) {
      setError(
        "Enter your Evantra ID.",
      );
      return;
    }

    if (!password) {
      setError(
        "Enter your password.",
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await authenticate(
          normalizedId,
          password,
        );

      /*
       * The backend currently returns
       * the authenticated account and
       * session information.
       *
       * We keep the result available
       * for the session layer to consume.
       */
      if (!result.session) {
        throw new Error(
          "Authentication succeeded, but no session was returned.",
        );
      }

      const returnTo =
        searchParams.get("returnTo") ?? "";

      if (
        returnTo.startsWith("/") &&
        !returnTo.startsWith("//")
      ) {
        router.push(returnTo);
        router.refresh();
        return;
      }

      if (
        returnTo &&
        isAllowedAbsoluteSurfaceUrl(returnTo)
      ) {
        window.location.assign(returnTo);
        return;
      }

      const fallback =
        buildWorkspaceUrl("/workspace/account");

      if (
        fallback.startsWith("http://") ||
        fallback.startsWith("https://")
      ) {
        window.location.assign(fallback);
        return;
      }

      router.push(fallback);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <IdentityShell
      title="Evantra Identity"
      description="Secure access to the Evantra digital ecosystem."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-300">
            {error}
          </div>
        )}

        {/* Evantra ID */}
        <div>
          <label
            htmlFor="evantraId"
            className="mb-2 block text-sm font-medium text-white/80"
          >
            Evantra ID
          </label>

          <input
            id="evantraId"
            name="evantraId"
            type="text"
            autoComplete="username"
            value={evantraId}
            onChange={(event) =>
              setEvantraId(
                event.target.value,
              )
            }
            placeholder="yourname@evantra"
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/50 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <p className="mt-2 text-xs text-white/30">
            Example: debuck@evantra
          </p>
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs text-[#e6b24a]/80 transition hover:text-[#e6b24a]"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/50 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              disabled={loading}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/30 transition hover:text-white/70"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Registration */}
      <div className="mt-8 border-t border-white/10 pt-6 text-center">
        <p className="text-sm text-white/40">
          Don't have an Evantra ID?
        </p>

        <Link
          href="/register"
          className="mt-2 inline-block text-sm font-medium text-[#e6b24a] transition hover:text-[#f0c15e]"
        >
          Create your Evantra ID
        </Link>
      </div>
    </IdentityShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <IdentityShell
          title="Evantra Identity"
          description="Secure access to the Evantra digital ecosystem."
        >
          <div className="flex items-center justify-center py-10 text-sm text-white/50">
            Loading...
          </div>
        </IdentityShell>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}