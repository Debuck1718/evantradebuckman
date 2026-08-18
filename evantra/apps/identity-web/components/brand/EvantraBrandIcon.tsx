import React from "react";

interface EvantraBrandIconProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export function EvantraBrandIcon({
  size = 40,
  className = "",
  showGlow = true,
}: EvantraBrandIconProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-2xl bg-[#e6b24a]/20 blur-md pointer-events-none"
          style={{ transform: "scale(1.15)" }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-sm"
      >
        <defs>
          <linearGradient
            id="evantraGoldGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fae59a" />
            <stop offset="45%" stopColor="#e6b24a" />
            <stop offset="100%" stopColor="#b6831d" />
          </linearGradient>

          <linearGradient
            id="evantraShieldGrad"
            x1="15%"
            y1="10%"
            x2="85%"
            y2="90%"
          >
            <stop offset="0%" stopColor="#0f2b42" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#071a2c" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#040c14" stopOpacity="1" />
          </linearGradient>

          <linearGradient
            id="evantraBorderGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fae59a" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#e6b24a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a37418" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Outer Shield Container */}
        <path
          d="M50 8 L85 24 V52 C85 71.5 70 87 50 93 C30 87 15 71.5 15 52 V24 L50 8 Z"
          fill="url(#evantraShieldGrad)"
          stroke="url(#evantraBorderGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner Facet / Diamond geometry representing Evantra */}
        {/* Top facet */}
        <path
          d="M50 20 L73 34 L50 48 L27 34 Z"
          fill="url(#evantraGoldGrad)"
          opacity="0.9"
        />

        {/* Left facet */}
        <path
          d="M27 38 L48 51 V78 L27 63 Z"
          fill="url(#evantraGoldGrad)"
          opacity="0.75"
        />

        {/* Right facet */}
        <path
          d="M73 38 L73 63 L52 78 V51 Z"
          fill="url(#evantraGoldGrad)"
          opacity="1"
        />

        {/* Central Core Light Line */}
        <line
          x1="50"
          y1="48"
          x2="50"
          y2="78"
          stroke="#fae59a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
