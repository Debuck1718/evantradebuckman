"use client";

import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ scale: 1.01 }}
      animate={{
        scale: 1.03,
        x: [-8, 8, -8],
      }}
      transition={{
        scale: {
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
        x: {
          duration: 45,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      }}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Headquarters Image */}

      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/hero/headquarters-campus.webp')",
          backgroundPosition: "68% center",
        }}
      />

      {/* Main Left Overlay */}

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-r

          from-[#06131F]/55

          via-[#06131F]/18

          to-transparent
        "
      />

      {/* Top Fade */}

      <div
        className="
          absolute
          inset-x-0
          top-0

          h-44

          bg-gradient-to-b

          from-[#06131F]/65

          via-[#06131F]/25

          to-transparent
        "
      />

      {/* Bottom Fade */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0

          h-56

          bg-gradient-to-t

          from-[#06131F]/70

          via-[#06131F]/25

          to-transparent
        "
      />

      {/* Warm Gold Light */}

      <div
        className="
          absolute

          right-[-180px]
          top-[-60px]

          h-[700px]
          w-[700px]

          rounded-full

          bg-[#D6A43A]/12

          blur-[180px]
        "
      />

      {/* Engineering Blue Glow */}

      <div
        className="
          absolute

          left-[-200px]
          bottom-[-120px]

          h-[520px]
          w-[520px]

          rounded-full

          bg-[#0B4F8C]/10

          blur-[150px]
        "
      />

      {/* Soft Sun Glow */}

      <div
        className="
          absolute

          right-[18%]
          top-[12%]

          h-[380px]
          w-[380px]

          rounded-full

          bg-[#FFD77A]/10

          blur-[120px]
        "
      />

      {/* Cinematic Vignette */}

      <div
        className="
          absolute
          inset-0

          shadow-[inset_0_0_180px_rgba(0,0,0,0.18)]
        "
      />

      {/* Moving Light Sweep */}

      <motion.div
        initial={{ x: "-30%" }}
        animate={{ x: "130%" }}
        transition={{
          duration: 16,
          repeat: Infinity,
          repeatDelay: 8,
          ease: "linear",
        }}
        className="
          absolute

          inset-y-0

          w-64

          rotate-12

          bg-gradient-to-r

          from-transparent

          via-white/8

          to-transparent

          blur-3xl
        "
      />
    </motion.div>
  );
}