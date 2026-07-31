"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

interface RevealProps {
  children: ReactNode;

  className?: string;

  direction?: Direction;

  delay?: number;

  duration?: number;

  distance?: number;

  blur?: boolean;

  once?: boolean;

  amount?: number;
}

export default function Reveal({
  children,
  className,

  direction = "up",

  delay = 0,

  duration = 0.7,

  distance = 40,

  blur = true,

  once = true,

  amount = 0.2,
}: RevealProps) {
  const getHiddenState = () => {
    switch (direction) {
      case "up":
        return {
          opacity: 0,
          y: distance,
          filter: blur ? "blur(10px)" : "blur(0px)",
        };

      case "down":
        return {
          opacity: 0,
          y: -distance,
          filter: blur ? "blur(10px)" : "blur(0px)",
        };

      case "left":
        return {
          opacity: 0,
          x: distance,
          filter: blur ? "blur(10px)" : "blur(0px)",
        };

      case "right":
        return {
          opacity: 0,
          x: -distance,
          filter: blur ? "blur(10px)" : "blur(0px)",
        };

      case "scale":
        return {
          opacity: 0,
          scale: 0.95,
          filter: blur ? "blur(10px)" : "blur(0px)",
        };

      default:
        return {
          opacity: 0,
        };
    }
  };

  const variants: Variants = {
    hidden: getHiddenState(),

    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",

      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Premium easing
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount,
      }}
    >
      {children}
    </motion.div>
  );
}