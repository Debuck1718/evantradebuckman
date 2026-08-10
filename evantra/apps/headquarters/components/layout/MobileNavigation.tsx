"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowRight,
  Building2,
  FlaskConical,
  Home,
  Info,
  Lightbulb,
  Mail,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

import { EvantraButton } from "@/components/shared/EvantraButton";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
  },
  {
    label: "Company",
    href: "/company",
    icon: Building2,
  },
  {
    label: "Innovation",
    href: "/companies/innovation",
    icon: Lightbulb,
  },
  {
    label: "Research",
    href: "/research",
    icon: FlaskConical,
  },
  {
    label: "Resources",
    href: "/resources",
    icon: BookOpen,
  },
  {
    label: "Identity",
    href: "/identity",
    icon: ShieldCheck,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
  },
];

export default function MobileNavigation({
  open,
  onClose,
}: MobileNavigationProps) {
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
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}

          <motion.div
            className="
              fixed
              inset-0
              z-40
              bg-slate-950/40
              backdrop-blur-sm
              lg:hidden
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Navigation Panel */}

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              fixed
              top-[105px]
              left-4
              right-4
              z-50
              overflow-hidden
              rounded-[28px]
              border
              border-white/10
              bg-[#081521]/96
              shadow-[0_30px_80px_rgba(0,0,0,.35)]
              backdrop-blur-3xl
              lg:hidden
            "
          >
            <div className="p-6">

              {/* Navigation */}

              <nav
                aria-label="Mobile primary navigation"
                className="space-y-2"
              >
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <motion.div
                      key={item.href}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={
                          active
                            ? "page"
                            : undefined
                        }
                        className={`
                          flex
                          items-center
                          justify-between
                          rounded-2xl
                          px-4
                          py-4
                          transition-all

                          ${
                            active
                              ? `
                                border
                                border-[hsl(var(--accent))]/30
                                bg-[hsl(var(--accent))]/10
                                text-[hsl(var(--accent))]
                              `
                              : `
                                text-white/85
                                hover:bg-white/5
                                hover:text-white
                              `
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <Icon size={20} />

                          <span className="font-medium">
                            {item.label}
                          </span>
                        </div>

                        <ArrowRight size={18} />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* CTA */}

              <div className="mt-8">
                <Link
                  href="/contact"
                  onClick={onClose}
                >
                  <EvantraButton
                    fullWidth
                    rightIcon={
                      <ArrowRight size={18} />
                    }
                  >
                    Work With Us
                  </EvantraButton>
                </Link>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}