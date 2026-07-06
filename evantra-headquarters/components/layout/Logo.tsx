"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

import Logo from "./Logo";
import Navigation from "./Navigation";
import SearchButton from "./SearchButton";

import { EvantraButton } from "@/components/shared/EvantraButton";

export default function GlobalHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
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
            y: -35,
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
            max-w-[1320px]

            rounded-[28px]

            border

            transition-all
            duration-500

            ${
              scrolled
                ? `
                  border-white/10
                  bg-[#081521]/88
                  shadow-[0_20px_60px_rgba(0,0,0,.25)]
                  backdrop-blur-3xl
                `
                : `
                  border-white/10
                  bg-[#081521]/45
                  backdrop-blur-3xl
                `
            }
          `}
        >
          <div
            className="
              flex
              h-[74px]
              items-center
              justify-between

              px-5

              lg:px-8
            "
          >
            {/* Logo */}

            <div className="flex shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation */}

            <div className="hidden lg:flex">
              <Navigation dark />
            </div>

            {/* Right Side */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div className="hidden md:flex">
                <SearchButton dark />
              </div>

              <div className="hidden lg:block">
                <EvantraButton
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Work With Us
                </EvantraButton>
              </div>

              {/* Mobile Toggle */}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/15

                  bg-white/10

                  text-white

                  backdrop-blur-xl

                  transition-all

                  hover:bg-white/20

                  lg:hidden
                "
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

      {/* Mobile Navigation */}

      {mobileOpen && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          className="
            fixed

            top-[105px]
            left-4
            right-4

            z-40

            rounded-3xl

            border
            border-white/10

            bg-[#081521]/95

            backdrop-blur-3xl

            shadow-2xl

            lg:hidden
          "
        >
          <div className="flex flex-col p-6">

            <Navigation dark />

            <div className="mt-6">
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
    </>
  );
}