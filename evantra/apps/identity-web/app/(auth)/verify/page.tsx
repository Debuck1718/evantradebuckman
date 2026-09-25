"use client";

import {
    Suspense,
    useEffect,
    useState,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import Link from "next/link";

import {
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Mail,
} from "lucide-react";

import {
    verifyAccount,
} from "../../lib/api";

import {
    useIdentitySession,
} from "../../../components/identity/IdentitySessionProvider";

function VerifyPageContent() {
    const router = useRouter();
    const searchParams =
        useSearchParams();

    /*
     * Verification activates the account but
     * does not itself create a browser
     * session, so the cookie on this device
     * can still be the stale pre-verification
     * value. Refreshing the shared session
     * context here means the Workspace opens
     * already knowing who the visitor is,
     * instead of racing the sign-in gate.
     */
    const { refresh } =
        useIdentitySession();

    const token =
        searchParams.get("token");

    /*
     * Where to go after verification.
     *
     * For OAuth clients this is the
     * /oauth/authorize request that
     * originally sent the visitor to
     * sign in, so the authorization
     * code is issued and the user lands
     * back on the client's site.
     *
     * Only same-origin relative paths are
     * honoured so a crafted link cannot
     * bounce a visitor off-origin.
     */
    const requestedReturnTo =
        searchParams.get("returnTo") ?? "";

    /*
     * A visitor who verified a normal
     * (non-OAuth) Evantra ID should land
     * directly in the Workspace, not on the
     * sign-in form they have already
     * satisfied. OAuth flows always pass an
     * explicit returnTo, so the fallback
     * only applies to first-party sign-ups.
     */
    const returnTo =
        requestedReturnTo.startsWith("/") &&
        !requestedReturnTo.startsWith("//")
            ? requestedReturnTo
            : "/workspace/hub";

    const [status, setStatus] =
        useState<
            "verifying" |
            "success" |
            "pending" |
            "error"
        >("verifying");

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        if (!token) {
            /*
             * No token means the visitor
             * reached /verify directly
             * rather than through the email
             * link. Verification can only
             * happen from that link, so show
             * the pending state instead of a
             * failure.
             */
            setStatus("pending");
            setMessage(
                "Open the verification link we emailed you to confirm your Evantra ID.",
            );
            return;
        }

        let cancelled = false;

        async function verify() {
            /*
             * Re-check the token inside the
             * closure. The guard above does not
             * narrow `token` here because this
             * async function can run after the
             * effect body has completed.
             */
            if (!token?.trim()) {
                return;
            }

            try {
                await verifyAccount(token.trim());

                if (cancelled) {
                    return;
                }

                setStatus("success");
                setMessage(
                    "Your Evantra ID has been verified successfully.",
                );

                /*
                 * Re-read the session now that the
                 * account is active so the Workspace
                 * does not flash the sign-in gate.
                 */
                await refresh().catch(() => undefined);

                /*
                 * Move the visitor straight into the
                 * Workspace once verification lands.
                 * The button remains for anyone who
                 * wants to read the confirmation.
                 */
                if (!cancelled) {
                    router.replace(returnTo);
                }
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setStatus("error");

                setMessage(
                    error instanceof Error
                        ? error.message
                        : "We could not verify your Evantra ID.",
                );
            }
        }

        verify();

        return () => {
            cancelled = true;
        };
    }, [token, refresh, router, returnTo]);

    return (
        <main className="min-h-screen bg-[#06131f] text-white">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-6">
                <div className="w-full max-w-md">

                    {/* Brand */}
                    <div className="mb-10 flex justify-center">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
                                <ShieldCheck
                                    size={22}
                                    className="text-[#e6b24a]"
                                />
                            </div>

                            <div>
                                <p className="text-sm font-semibold tracking-[0.22em]">
                                    EVANTRA
                                </p>

                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                                    Identity
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card */}
                    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur">
                        {status === "verifying" && (
                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#e6b24a]/20 bg-[#e6b24a]/10">
                                    <Loader2
                                        size={28}
                                        className="animate-spin text-[#e6b24a]"
                                    />
                                </div>

                                <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
                                    Evantra Identity
                                </p>

                                <h1 className="text-2xl font-semibold">
                                    Verifying your identity
                                </h1>

                                <p className="mt-3 text-sm leading-6 text-white/50">
                                    Please wait while we verify
                                    your Evantra ID.
                                </p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
                                    <CheckCircle2
                                        size={30}
                                        className="text-emerald-400"
                                    />
                                </div>

                                <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
                                    Identity verified
                                </p>

                                <h1 className="text-2xl font-semibold">
                                    You're all set.
                                </h1>

                                <p className="mt-3 text-sm leading-6 text-white/50">
                                    {message}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            returnTo,
                                        )
                                    }
                                    className="mt-8 w-full rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {status === "pending" && (
                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#e6b24a]/20 bg-[#e6b24a]/10">
                                    <Mail
                                        size={28}
                                        className="text-[#e6b24a]"
                                    />
                                </div>

                                <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
                                    Pending verification
                                </p>

                                <h1 className="text-2xl font-semibold">
                                    Check your email.
                                </h1>

                                <p className="mt-3 text-sm leading-6 text-white/50">
                                    {message}
                                </p>

                                <div className="mt-8 flex flex-col gap-3">
                                    <Link
                                        href={`/verify/resend?returnTo=${encodeURIComponent(
                                            returnTo,
                                        )}`}
                                        className="w-full rounded-xl bg-[#e6b24a] px-5 py-3 text-center text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
                                    >
                                        Resend verification email
                                    </Link>

                                    <Link
                                        href={`/login?returnTo=${encodeURIComponent(
                                            returnTo,
                                        )}`}
                                        className="w-full rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
                                    >
                                        Return to sign in
                                    </Link>
                                </div>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10">
                                    <AlertCircle
                                        size={30}
                                        className="text-red-400"
                                    />
                                </div>

                                <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#e6b24a]">
                                    Verification unsuccessful
                                </p>

                                <h1 className="text-2xl font-semibold">
                                    We couldn't verify you.
                                </h1>

                                <p className="mt-3 text-sm leading-6 text-white/50">
                                    {message}
                                </p>

                                <div className="mt-8 flex flex-col gap-3">
                                    <Link
                                        href={`/verify/resend?returnTo=${encodeURIComponent(
                                            returnTo,
                                        )}`}
                                        className="w-full rounded-xl bg-[#e6b24a] px-5 py-3 text-center text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
                                    >
                                        Resend verification email
                                    </Link>

                                    <Link
                                        href={`/login?returnTo=${encodeURIComponent(
                                            returnTo,
                                        )}`}
                                        className="w-full rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
                                    >
                                        Return to sign in
                                    </Link>
                                </div>
                            </div>
                        )}
                    </section>

                    <p className="mt-8 text-center text-xs text-white/30">
                        Protected by Evantra Identity
                    </p>
                </div>
            </div>
        </main>
    );
}

export default function VerifyPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#06131f] text-white">
                    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-6">
                        <Loader2
                            size={28}
                            className="animate-spin text-[#e6b24a]"
                        />
                    </div>
                </main>
            }
        >
            <VerifyPageContent />
        </Suspense>
    );
}