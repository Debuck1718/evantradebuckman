"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerChildrenProps {
  children: ReactNode;

  className?: string;

  stagger?: number;

  delayChildren?: number;

  once?: boolean;

  amount?: number;
}

const containerVariants = (
  stagger: number,
  delayChildren: number
): Variants => ({
  hidden: {},

  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export default function StaggerChildren({
  children,

  className,

  stagger = 0.12,

  delayChildren = 0,

  once = true,

  amount = 0.2,
}: StaggerChildrenProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants(
        stagger,
        delayChildren
      )}
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