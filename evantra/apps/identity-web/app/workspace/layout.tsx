import { WorkspaceShell } from "../../components/identity/WorkspaceShell";

export default function WorkspaceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	/*
	 * Navigation now lives in WorkspaceShell,
	 * which renders a grouped sidebar on large
	 * screens and a drawer on small screens.
	 *
	 * The previous flat list of fifteen tabs
	 * overflowed on every phone and turned the
	 * header into an unreadable strip.
	 */
	return <WorkspaceShell>{children}</WorkspaceShell>;
}
