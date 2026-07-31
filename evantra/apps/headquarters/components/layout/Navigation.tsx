"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Companies", href: "/companies" },
  { label: "Innovation", href: "/innovation" },
  { label: "Research", href: "/research" },
  { label: "Impact", href: "/impact" },
  { label: "Contact", href: "/contact" },
];

interface NavigationProps {
  /** True when header is on a light background (after scrolling). */
  dark?: boolean;
}

export default function Navigation({
  dark = false,
}: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      className="
        hidden
        items-center
        gap-10
        lg:flex
      "
    >
      {navigation.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="
              group
              relative
              py-2
            "
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

            {/* Gold Underline */}

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

                ${
                  active
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }

                transition-all
                duration-300
              `}
            />
          </Link>
        );
      })}
    </nav>
  );
}