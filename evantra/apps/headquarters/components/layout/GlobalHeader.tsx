"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

import Logo from "./Logo";
import Navigation from "./Navigation";
import SearchButton from "./SearchButton";

import { EvantraButton } from "../shared/EvantraButton";
import MobileNavigation from "./MobileNavigation";
export default function GlobalHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50
          flex
          justify-center
          px-4
          pt-5
        "
      >
        <motion.div
          initial={{
            y: -40,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className={`
            w-full
            max-w-[1440px]

            rounded-[28px]

            border

            transition-all
            duration-500

            ${
              scrolled
                ? `
                  border-slate-200/80
                  bg-white/95
                  shadow-[0_20px_60px_rgba(15,23,42,.12)]
                  backdrop-blur-2xl
                `
                : `
                  border-white/10
                  bg-white/10
                  backdrop-blur-2xl
                `
            }
          `}
        >
          <div
            className="
              grid
              h-[88px]

              grid-cols-[auto_1fr_auto]

              items-center

              gap-8

              px-6

              lg:px-8
            "
          >
            {/* ================================================= */}
            {/* Logo */}
            {/* ================================================= */}

            <div className="flex shrink-0 items-center">
              <Logo />
            </div>

            {/* ================================================= */}
            {/* Navigation */}
            {/* ================================================= */}

            <div
              className="
                hidden

                justify-center

                lg:flex
              "
            >
              <Navigation dark={scrolled} />
            </div>

            {/* ================================================= */}
            {/* Right Actions */}
            {/* ================================================= */}

            <div
              className="
                flex
                items-center
                justify-end

                gap-3
              "
            >
              <div className="hidden md:block">
                <SearchButton dark={scrolled} />
              </div>

              <div className="hidden lg:block">
                <EvantraButton
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Work With Us
                </EvantraButton>
              </div>

              {/* Mobile Menu */}

              <button
                aria-label={
                  mobileOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                onClick={() =>
                  setMobileOpen(!mobileOpen)
                }
                className={`
                  flex

                  h-11
                  w-11

                  items-center
                  justify-center

                  rounded-full

                  border

                  transition-all
                  duration-300

                  lg:hidden

                  ${
                    scrolled
                      ? `
                        border-slate-200
                        bg-slate-100
                        text-slate-900
                      `
                      : `
                        border-white/20
                        bg-white/10
                        text-white
                      `
                  }
                `}
              >
                {mobileOpen ? (
                  <X size={22} />
                ) : (
                  <Menu size={22} />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </header>

      <MobileNavigation
    open={mobileOpen}
    onClose={() => setMobileOpen(false)}
/>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -16,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              fixed

              left-4
              right-4
              top-[108px]

              z-40

              overflow-hidden

              rounded-[28px]

              border
              border-white/10

              bg-[#081521]/96

              shadow-2xl

              backdrop-blur-3xl

              lg:hidden
            "
          >
            <div className="p-6">
              <Navigation dark />

              <div className="mt-8">
                <EvantraButton
                  fullWidth
                  rightIcon={<ArrowRight size={18} />}
                >
                  Work With Us
                </EvantraButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}