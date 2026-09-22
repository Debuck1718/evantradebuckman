import Link from "next/link";

/**
 * Shared navigation for the developer
 * documentation area.
 *
 * Kept in one place so every page under
 * /developers and /docs exposes the same
 * set of links.
 */
const links = [
  {
    href: "/developers",
    label: "Integration guide",
  },
  {
    href: "/developers/integration-kit",
    label: "Integration kit",
  },
  {
    href: "/docs",
    label: "Documentation",
  },
  {
    href: "/developers/suggestions",
    label: "Suggestions",
  },
] as const;

export function DeveloperNav({
  activeHref,
}: {
  activeHref: string;
}) {
  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = link.href === activeHref;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-xl border border-[#e6b24a]/40 bg-[#e6b24a]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f5d48a]"
                : "rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60 transition hover:border-[#e6b24a]/30 hover:bg-white/[0.06] hover:text-white"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}