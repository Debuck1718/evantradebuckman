"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Company",
    href: "/company",
  },
  {
    label: "Innovation",
    href: "/companies/innovation",
  },
  {
    label: "Research",
    href: "/research",
  },
  {
    label: "Resources",
    href: "/resources",
  },
  {
    label: "Identity",
    href: "/identity",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

interface NavigationProps {
  /**
   * True when header is on a light background.
   */
  dark?: boolean;
}

export default function Navigation({
  dark = false,
}: NavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <nav
      aria-label="Primary navigation"
      className="flex items-center gap-7"
    >
      {navigation.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="group relative py-2"
            aria-current={active ? "page" : undefined}
          >
            <span
              className={`
                relative
                z-10
                text-[15px]
                font-semibold
                tracking-[0.01em]
                transition-all
                duration-300

                ${
                  dark
                    ? active
                      ? "text-[#0B5CAB]"
                      : "text-slate-700 group-hover:text-[#0B5CAB]"
                    : active
                      ? "text-[hsl(var(--accent))]"
                      : "text-white/90 group-hover:text-white"
                }
              `}
            >
              {item.label}
            </span>

            <motion.span
              layoutId="navigation-indicator"
              transition={{
                type: "spring",
                stiffness: 360,
                damping: 28,
              }}
              className={`
                absolute
                bottom-0
                left-0
                h-[3px]
                rounded-full
                bg-[hsl(var(--accent))]
                transition-all
                duration-300

                ${
                  active
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }
              `}
            />
          </Link>
        );
      })}
    </nav>
  );
}