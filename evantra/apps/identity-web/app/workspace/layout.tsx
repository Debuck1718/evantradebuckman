import Link from "next/link";
import { EvantraBrandIcon } from "../../components/brand/EvantraBrandIcon";

export default function WorkspaceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-[#06131f] text-white">
			<nav className="border-b border-white/10 bg-[#071826]/90 backdrop-blur sticky top-0 z-40">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5 sm:px-8 lg:px-10">
					{/* Brand Logo & Name */}
					<Link
						href="/workspace/hub"
						className="group flex items-center gap-3 transition"
					>
						<EvantraBrandIcon size={34} />
						<div className="flex flex-col">
							<span className="text-xs font-semibold tracking-[0.24em] text-white group-hover:text-[#fae59a] transition">
								EVANTRA
							</span>
							<span className="text-[10px] uppercase tracking-[0.2em] text-[#e6b24a]">
								Workspace
							</span>
						</div>
					</Link>

					{/* Workspace Navigation Links */}
					<div className="hidden md:flex items-center gap-5 text-xs font-medium tracking-wider uppercase text-white/70">
						<Link
							href="/workspace/hub"
							className="transition hover:text-[#e6b24a]"
						>
							Hub
						</Link>
						<Link
							href="/workspace/account"
							className="transition hover:text-[#e6b24a]"
						>
							Account
						</Link>
						<Link
							href="/workspace/applications"
							className="transition hover:text-[#e6b24a]"
						>
							Applications
						</Link>
						<Link
							href="/workspace/plan"
							className="transition hover:text-[#e6b24a]"
						>
							Plan
						</Link>
						<Link
							href="/workspace/profile"
							className="transition hover:text-[#e6b24a]"
						>
							Profile
						</Link>
						<Link
							href="/workspace/promises"
							className="transition hover:text-[#e6b24a]"
						>
							Promises
						</Link>
						<Link
							href="/workspace/burden"
							className="transition hover:text-[#e6b24a]"
						>
							Burden
						</Link>
					</div>

					{/* Actions / Auth Link */}
					<div className="flex items-center gap-4 text-xs font-medium">
						<Link
							href="/security"
							className="hidden sm:inline-block text-white/60 transition hover:text-white"
						>
							Security
						</Link>
						<Link
							href="/logout"
							className="rounded-lg border border-[#e6b24a]/30 bg-[#e6b24a]/10 px-3 py-1.5 text-[#e6b24a] transition hover:bg-[#e6b24a] hover:text-[#06131f]"
						>
							Sign out
						</Link>
					</div>
				</div>

				{/* Mobile horizontal navigation */}
				<div className="flex md:hidden overflow-x-auto border-t border-white/5 px-6 py-2.5 gap-4 text-xs uppercase tracking-wider text-white/60 scrollbar-none">
					<Link href="/workspace/hub" className="shrink-0 hover:text-white">Hub</Link>
					<Link href="/workspace/account" className="shrink-0 hover:text-white">Account</Link>
					<Link href="/workspace/applications" className="shrink-0 hover:text-white">Applications</Link>
					<Link href="/workspace/plan" className="shrink-0 hover:text-white">Plan</Link>
					<Link href="/workspace/profile" className="shrink-0 hover:text-white">Profile</Link>
					<Link href="/workspace/promises" className="shrink-0 hover:text-white">Promises</Link>
					<Link href="/workspace/burden" className="shrink-0 hover:text-white">Burden</Link>
					<Link href="/security" className="shrink-0 hover:text-white">Security</Link>
				</div>
			</nav>

			{children}
		</div>
	);
}
