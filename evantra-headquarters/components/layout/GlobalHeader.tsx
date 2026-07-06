"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu } from "lucide-react";

import Logo from "./Logo";
import Navigation from "./Navigation";
import SearchButton from "./SearchButton";

import { Button } from "@/components/ui/button";

export default function GlobalHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-50
        flex
        justify-center
        px-5
        pt-6
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
        }}
        className={`
          w-full
          max-w-[1440px]
          rounded-3xl
          transition-all
          duration-500

          ${
            scrolled
              ? `
                border
                border-slate-200
                bg-white/95
                shadow-2xl
                backdrop-blur-xl
              `
              : `
                border
                border-white/10
                bg-white/10
                backdrop-blur-xl
              `
          }
        `}
      >
        <div
          className="
            flex
            h-[88px]
            items-center
            justify-between
            px-8
          "
        >
          <Logo />

          <Navigation dark={!scrolled} />

          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <SearchButton dark={!scrolled} />

            <Button
              size="lg"
              className="
                hidden
                lg:flex
                rounded-full
                bg-[hsl(var(--accent))]
                px-6
                text-black
                hover:scale-[1.02]
                hover:bg-[hsl(var(--accent))]
              "
            >
              Work With Us

              <ArrowRight
                className="
                  ml-2
                  h-4
                  w-4
                "
              />
            </Button>

            <button
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                lg:hidden

                border-white/20
                text-white
              "
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.div>
    </header>
  );
}