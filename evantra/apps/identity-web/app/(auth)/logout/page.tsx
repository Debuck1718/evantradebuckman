"use client";

import {
	useEffect,
	useRef,
	useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	Loader2,
	ShieldCheck,
} from "lucide-react";

import { logout } from "../../lib/api";
import { useIdentitySession } from "../../../components/identity/IdentitySessionProvider";

export default function LogoutPage() {
	const router = useRouter();
	const { session, loading } =
		useIdentitySession();

	const [error, setError] =
		useState("");

	const hasStarted =
		useRef(false);

	useEffect(() => {
		if (loading || hasStarted.current) {
			return;
		}

		hasStarted.current = true;

		async function terminateSession() {
			try {
				await logout(session?.sessionId);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Unable to complete sign out.",
				);
			} finally {
				localStorage.removeItem(
					"evantra_session_id",
				);
				localStorage.removeItem(
					"evantra_account",
				);

				router.replace("/login");
				router.refresh();
			}
		}

		void terminateSession();
	}, [loading, router, session?.sessionId]);

	return (
		<main className="min-h-screen bg-[#06131f] text-white">
			<div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
				<section className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#e6b24a]/30 bg-[#e6b24a]/10">
						<ShieldCheck
							size={22}
							className="text-[#e6b24a]"
						/>
					</div>

					<h1 className="mt-6 text-2xl font-semibold">
						Signing you out
					</h1>

					<p className="mt-3 text-sm leading-6 text-white/50">
						Ending your Evantra Identity session.
					</p>

					<div className="mt-6 flex justify-center">
						<Loader2
							size={24}
							className="animate-spin text-[#e6b24a]"
						/>
					</div>

					{error && (
						<div
							role="alert"
							className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
						>
							{error}
						</div>
					)}

					<div className="mt-7">
						<Link
							href="/login"
							className="text-sm text-[#e6b24a] transition hover:text-[#f0c261]"
						>
							Return to sign in
						</Link>
					</div>
				</section>
			</div>
		</main>
	);
}
