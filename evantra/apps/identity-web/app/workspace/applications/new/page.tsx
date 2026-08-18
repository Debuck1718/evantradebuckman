"use client";

import {
	FormEvent,
	useMemo,
	useState,
} from "react";

import Link from "next/link";

import {
	ArrowLeft,
	CheckCircle2,
	Loader2,
	ShieldCheck,
} from "lucide-react";

import {
	registerOAuthClient,
	registerOAuthRedirectUri,
} from "../../../lib/api";

import {
	useIdentitySession,
} from "../../../../components/identity/IdentitySessionProvider";
import { EvantraBrandIcon } from "../../../../components/brand/EvantraBrandIcon";
import { GlassCard } from "../../../../components/ui/GlassCard";

export default function RegisterApplicationPage() {
	const {
		account,
		session,
		loading: sessionLoading,
	} = useIdentitySession();

	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [homepageUrl, setHomepageUrl] =
		useState("");
	const [redirectUri, setRedirectUri] =
		useState("");
	const [description, setDescription] =
		useState("");

	const [loading, setLoading] =
		useState(false);

	const [error, setError] =
		useState("");

	const [result, setResult] = useState<{
		clientId: string;
		clientSecret: string;
		redirectUri: string;
	} | null>(null);

	const canSubmit = useMemo(
		() =>
			Boolean(
				account?.id &&
					name.trim() &&
					slug.trim() &&
					redirectUri.trim(),
			),
		[account?.id, name, redirectUri, slug],
	);

	async function handleSubmit(
		event: FormEvent<HTMLFormElement>,
	) {
		event.preventDefault();

		setError("");
		setResult(null);

		if (!account?.id || !session?.sessionId) {
			setError(
				"Sign in again to register an application.",
			);
			return;
		}

		if (!name.trim()) {
			setError("Application name is required.");
			return;
		}

		if (!slug.trim()) {
			setError("Application slug is required.");
			return;
		}

		if (!redirectUri.trim()) {
			setError("At least one redirect URI is required.");
			return;
		}

		setLoading(true);

		try {
			const created = await registerOAuthClient({
				ownerAccountId: account.id,
				name,
				slug,
				homepageUrl,
				description,
			});

			const createdRedirect =
				await registerOAuthRedirectUri({
					clientId: created.client.clientId,
					redirectUri,
					primary: true,
				});

			setResult({
				clientId: created.client.clientId,
				clientSecret: created.clientSecret,
				redirectUri:
					createdRedirect.redirectUri.redirectUri,
			});
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Unable to register this application.",
			);
		} finally {
			setLoading(false);
		}
	}

	if (sessionLoading) {
		return (
			<main className="min-h-screen bg-[#06131f] text-white">
				<div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
					<Loader2
						size={28}
						className="animate-spin text-[#e6b24a]"
					/>
				</div>
			</main>
		);
	}

	if (!account || !session) {
		return (
			<main className="min-h-screen bg-[#06131f] text-white">
				<div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
					<GlassCard variant="elevated" className="w-full p-8 text-center sm:p-10">
						<EvantraBrandIcon size={48} className="mx-auto" />

						<h1 className="mt-6 text-2xl font-semibold">
							Sign in required
						</h1>

						<p className="mt-3 text-sm text-white/50">
							Sign in to register an OAuth application.
						</p>

						<Link
							href="/login"
							className="mt-7 inline-flex rounded-xl bg-[#e6b24a] px-6 py-3 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261]"
						>
							Sign in
						</Link>
					</GlassCard>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-[#06131f] text-white">
			<div className="mx-auto w-full max-w-4xl px-6 py-10 md:px-8 md:py-14">
				<header className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6b24a]">
							Evantra OAuth
						</p>
						<h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
							Register application
						</h1>
					</div>

					<Link
						href="/workspace/applications"
						className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
					>
						<ArrowLeft size={16} />
						Back to applications
					</Link>
				</header>

				<section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl">
					<form
						onSubmit={handleSubmit}
						className="space-y-5"
					>
						<div>
							<label
								htmlFor="name"
								className="mb-2 block text-sm text-white/75"
							>
								Application name
							</label>
							<input
								id="name"
								value={name}
								onChange={(event) =>
									setName(event.target.value)
								}
								placeholder="Acme Dashboard"
								disabled={loading}
								className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/60 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:opacity-50"
							/>
						</div>

						<div>
							<label
								htmlFor="slug"
								className="mb-2 block text-sm text-white/75"
							>
								Slug
							</label>
							<input
								id="slug"
								value={slug}
								onChange={(event) =>
									setSlug(
										event.target.value
											.toLowerCase()
											.replace(/[^a-z0-9-]/g, "-")
											.replace(/-{2,}/g, "-"),
									)
								}
								placeholder="acme-dashboard"
								disabled={loading}
								className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/60 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:opacity-50"
							/>
						</div>

						<div>
							<label
								htmlFor="homepageUrl"
								className="mb-2 block text-sm text-white/75"
							>
								Homepage URL (optional)
							</label>
							<input
								id="homepageUrl"
								type="url"
								value={homepageUrl}
								onChange={(event) =>
									setHomepageUrl(event.target.value)
								}
								placeholder="https://app.example.com"
								disabled={loading}
								className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/60 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:opacity-50"
							/>
						</div>

						<div>
							<label
								htmlFor="redirectUri"
								className="mb-2 block text-sm text-white/75"
							>
								Primary redirect URI
							</label>
							<input
								id="redirectUri"
								type="url"
								value={redirectUri}
								onChange={(event) =>
									setRedirectUri(event.target.value)
								}
								placeholder="https://app.example.com/oauth/callback"
								disabled={loading}
								className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/60 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:opacity-50"
							/>
						</div>

						<div>
							<label
								htmlFor="description"
								className="mb-2 block text-sm text-white/75"
							>
								Description (optional)
							</label>
							<textarea
								id="description"
								rows={4}
								value={description}
								onChange={(event) =>
									setDescription(event.target.value)
								}
								placeholder="Describe what this OAuth client is used for."
								disabled={loading}
								className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#e6b24a]/60 focus:ring-2 focus:ring-[#e6b24a]/10 disabled:opacity-50"
							/>
						</div>

						{error && (
							<div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
								{error}
							</div>
						)}

						<button
							type="submit"
							disabled={!canSubmit || loading}
							className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6b24a] px-5 py-3.5 text-sm font-semibold text-[#06131f] transition hover:bg-[#f0c261] disabled:cursor-not-allowed disabled:opacity-60"
						>
							{loading ? (
								<>
									<Loader2
										size={17}
										className="animate-spin"
									/>
									Registering application...
								</>
							) : (
								"Create OAuth client"
							)}
						</button>
					</form>
				</section>

				{result && (
					<section className="mt-7 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6">
						<div className="flex items-center gap-2 text-emerald-300">
							<CheckCircle2 size={18} />
							<p className="text-sm font-semibold">
								OAuth client created
							</p>
						</div>

						<div className="mt-5 space-y-4 text-sm">
							<div>
								<p className="text-xs uppercase tracking-[0.16em] text-white/35">
									Client ID
								</p>
								<p className="mt-1 break-all text-white/85">
									{result.clientId}
								</p>
							</div>

							<div>
								<p className="text-xs uppercase tracking-[0.16em] text-white/35">
									Client Secret
								</p>
								<p className="mt-1 break-all text-white/85">
									{result.clientSecret}
								</p>
							</div>

							<div>
								<p className="text-xs uppercase tracking-[0.16em] text-white/35">
									Redirect URI
								</p>
								<p className="mt-1 break-all text-white/85">
									{result.redirectUri}
								</p>
							</div>
						</div>

						<p className="mt-4 text-xs text-white/45">
							Store the client secret now. It is only returned at creation time.
						</p>
					</section>
				)}
			</div>
		</main>
	);
}
