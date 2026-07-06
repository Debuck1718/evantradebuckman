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
    label: "Companies",
    href: "/companies",
  },
  {
    label: "Innovation",
    href: "/innovation",
  },
  {
    label: "Research",
    href: "/research",
  },
  {
    label: "Impact",
    href: "/impact",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

interface NavigationProps {
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
        lg:flex
        items-center
        gap-10
      "
    >
      {navigation.map((item) => {
        const active =
          pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="
              relative
              group
            "
          >
            <span
              className={`
                text-[15px]
                font-medium
                transition-colors
                duration-300

                ${
                  dark
                    ? active
                      ? "text-white"
                      : "text-white/80 group-hover:text-white"
                    : active
                    ? "text-[hsl(var(--primary))]"
                    : "text-slate-700 group-hover:text-[hsl(var(--primary))]"
                }
              `}
            >
              {item.label}
            </span>

            <motion.span
              layoutId="navigation-indicator"
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
              className={`
                absolute
                -bottom-2
                left-0
                h-[2px]
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