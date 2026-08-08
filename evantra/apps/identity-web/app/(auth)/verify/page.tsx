"use client";

import {
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
} from "lucide-react";

import {
    verifyAccount,
} from "../../lib/api";

export default function VerifyPage() {
    const router = useRouter();
    const searchParams =
        useSearchParams();

    const token =
        searchParams.get("token");

    const [status, setStatus] =
        useState<
            "verifying" |
            "success" |
            "error"
        >("verifying");

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage(
                "This verification link is missing its verification token.",
            );
            return;
        }

        let cancelled = false;

        async function verify() {
            try {
                await verifyAccount(token);

                if (cancelled) {
                    return;
                }

                setStatus("success");
                setMessage(
                    "Your Evantra ID has been verified successfully.",
                );
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
    }, [token]);

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
                                        router.push("/login")
                                    }
                                    className="mt-8 w-full rounded-xl bg-[#e6b24a] px-5 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
                                >
                                    Continue to Evantra Identity
                                </button>
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
                                        href="/verify/resend"
                                        className="w-full rounded-xl bg-[#e6b24a] px-5 py-3 text-center text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c15e]"
                                    >
                                        Resend verification email
                                    </Link>

                                    <Link
                                        href="/login"
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