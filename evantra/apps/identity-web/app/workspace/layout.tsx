import Link from "next/link";

export default function WorkspaceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-[#06131f] text-white">
			<nav className="border-b border-white/10 bg-[#071826]/80 backdrop-blur">
				<div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-5 px-6 py-4 text-sm sm:px-8 lg:px-10">
					<Link
						href="/workspace/hub"
						className="text-white/70 transition hover:text-white"
					>
						Hub
					</Link>

					<Link
						href="/workspace/account"
						className="text-white/70 transition hover:text-white"
					>
						Account
					</Link>

					<Link
						href="/workspace/burden"
						className="text-white/70 transition hover:text-white"
					>
						Burden
					</Link>

					<Link
						href="/workspace/promises"
						className="text-white/70 transition hover:text-white"
					>
						Promises
					</Link>

					<Link
						href="/workspace/plan"
						className="text-white/70 transition hover:text-white"
					>
						Plan
					</Link>

					<Link
						href="/workspace/profile"
						className="text-white/70 transition hover:text-white"
					>
						Profile
					</Link>

					<Link
						href="/workspace/applications"
						className="text-white/70 transition hover:text-white"
					>
						Applications
					</Link>

					<Link
						href="/security"
						className="text-white/70 transition hover:text-white"
					>
						Security
					</Link>

					<Link
						href="/contact-email"
						className="text-white/70 transition hover:text-white"
					>
						Contact email
					</Link>

					<Link
						href="/logout"
						className="text-[#e6b24a] transition hover:text-[#f0c261]"
					>
						Sign out
					</Link>
				</div>
			</nav>

			{children}
		</div>
	);
}
