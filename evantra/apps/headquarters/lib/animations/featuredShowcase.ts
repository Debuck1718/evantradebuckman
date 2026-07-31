import { Variants } from "framer-motion";

/* ============================================================
   Container
============================================================ */

export const showcaseContainer: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

/* ============================================================
   Fade Up
============================================================ */

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ============================================================
   Fade Left
============================================================ */

export const fadeLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ============================================================
   Fade Right
============================================================ */

export const fadeRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ============================================================
   Scale
============================================================ */

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ============================================================
   Floating Metric
============================================================ */

export const floatingMetric = {
  animate: {
    y: [0, -8, 0],

    transition: {
      repeat: Infinity,
      duration: 5,
      ease: "easeInOut",
    },
  },
};

/* ============================================================
   Dashboard Hover
============================================================ */

export const dashboardHover = {
  whileHover: {
    rotateX: 4,
    rotateY: -4,
    scale: 1.02,
  },

  transition: {
    duration: 0.35,
  },
};